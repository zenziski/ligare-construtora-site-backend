import fs from 'fs';
import path from 'path';
import moment from 'moment';

const jobsByName: any = {};

export default (app: { models: { BackgroundJobs: any; }; jobs: { now: (name: any, data: any) => Promise<any>; schedule: (date: any, name: any, data: any) => Promise<any>; }; }, opt: { directory: string; }) => {
    const { BackgroundJobs } = app.models;

    const optionsDefaults = {
        retryAfter: 10,
        priority: 1,
        attemps: 10
    };

    fs.readdirSync(opt.directory).map(n => path.join(opt.directory, n)).forEach(it => {
        if (it.endsWith('.js')) {
            const { name, options, handler } = require(it)(app);
            jobsByName[name] = { options: { ...optionsDefaults, ...(options || {}) }, handler };
        }
    });

    const runner = async () => {
        const jobsToProcess = await BackgroundJobs.find({ runAt: { $lte: new Date() }, status: { $in: ['waiting', 'retring'] } }, { executions: 0 }).sort({ priority: 1 }).lean();

        for (const job of jobsToProcess) {
            const jobData = jobsByName[job.name];
            if (jobData) {
                const startAt = new Date();
                try {
                    await BackgroundJobs.updateOne({ _id: job._id }, { $set: { status: 'running' } });
                    console.log(`Processing job ${job.name} with payload ${JSON.stringify(job.data)}`);

                    await jobData.handler(job.data);

                    const endAt: Date = new Date();

                    await BackgroundJobs.updateOne({ _id: job._id }, {
                        $set: { status: 'success' },
                        $push: {
                            executions: {
                                startAt: startAt,
                                endAt: endAt,
                                elapsedTime: (endAt.valueOf() - startAt.valueOf()) * 0.001,
                                success: true
                            }
                        }
                    });
                }
                catch (e: any) {
                    const endAt = new Date();

                    if (e && e['stack'] && e['message']) {
                        e = { error: e.message };
                    }

                    const isFail = (job.fails + 1) >= job.attemps;

                    await BackgroundJobs.updateOne({ _id: job._id }, {
                        $set: {
                            status: isFail ? 'error' : 'retring',
                            runAt: moment().add(jobData.options.retryAfter, 'seconds').toDate()
                        },
                        $inc: { fails: 1 },
                        $push: {
                            executions: {
                                startAt: startAt,
                                endAt: endAt,
                                elapsedTime: (endAt.valueOf() - startAt.valueOf()) * 0.001,
                                success: false,
                                data: e
                            }
                        }
                    });
                }
            }
        }

        setTimeout(runner, 5000);
    }

    app.jobs = {
        now: async (name: string | number, data: any) => {
            const jobData = jobsByName[name];
            if (!jobData) return null;

            const job = await BackgroundJobs.create({
                name,
                data,
                runAt: new Date(),
                priority: jobData.options.priority,
                attemps: jobData.options.attemps,
                frequency: 'once'
            });

            return job._id.toString();
        },
        schedule: async (date: moment.MomentInput, name: string | number, data: any) => {
            const jobData = jobsByName[name];
            if (!jobData) return null;

            const job = await BackgroundJobs.create({
                name,
                data,
                runAt: moment(date).toDate(),
                priority: jobData.options.priority,
                attemps: jobData.options.attemps,
                frequency: 'once'
            });

            return job._id.toString();
        }
    }

    if (Object.keys(jobsByName).length > 0) setTimeout(runner, 0);
}