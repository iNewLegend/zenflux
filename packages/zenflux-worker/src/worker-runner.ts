export interface WorkerTaskUnit {
    failed: ( error: Error ) => void;
    succeed: ( workerId: string ) => void;

    isAllUnitsFailed: () => boolean;

    getErrors(): Error[];
}

interface WorkerRunnerPromiseInterface {
    succeeded( callback?: ( workerId: string ) => void ): WorkerRunner;

    failed( callback?: ( error: Error ) => void ): WorkerRunner;

    allSucceeded( callback?: ( workerIds: [] ) => void ): WorkerRunner;

    allFailed( callback?: ( errors: Error[] ) => void ): WorkerRunner;
}

export class WorkerRunner implements WorkerRunnerPromiseInterface {
    private allErrors: Error[] = [];
    private allWorkersIds: string[] = [];

    private failedCallbacks: Array<( error: Error ) => void> = [];
    private succeedCallbacks: Array<( workerId: string ) => void> = [];
    private allFailedCallbacks: Array<( errors: Error[] ) => void> = [];
    private allSucceedCallbacks: Array<( workerIds: string[] ) => void> = [];

    private execution: Promise<void>;

    private taskUnit: WorkerTaskUnit = {
        failed: ( error: Error ) => {
            this.allErrors.push( error );
            this.failedCallbacks.forEach( cb => cb( error ) );
        },
        succeed: ( workerId: string ) => {
            this.allWorkersIds.push( workerId );
            this.succeedCallbacks.forEach( cb => cb( workerId ) );
        },

        isAllUnitsFailed: () => this.allErrors.length > 0,

        getErrors: () => this.allErrors
    };

    public constructor(
        private task: ( taskUnit?: WorkerTaskUnit, runner?: WorkerRunner ) => Promise<any>
    ) {
    }

    public succeeded( callback?: ( workerId: string ) => void ) {
        callback && this.succeedCallbacks.push( callback );

        return this.finalize();
    }

    public failed( callback?: ( error: Error ) => void ) {
        callback && this.failedCallbacks.push( callback );

        return this.finalize();
    }

    public allFailed( callback?: ( errors: Error[] ) => void ) {
        callback && this.allFailedCallbacks.push( callback );

        return this.finalize();
    }

    public allSucceeded( callback?: ( workerIds: [] ) => void ) {
        callback && this.allSucceedCallbacks.push( callback );

        return this.finalize();
    }

    private finalize() {
        return this;
    }

    private onFulfilled() {
        const haveErrors = this.allErrors.length > 0,
            haveAllSucceedCallbacks = this.allSucceedCallbacks.length > 0;

        if ( ! haveErrors && haveAllSucceedCallbacks ) {
            this.allSucceedCallbacks.forEach( cb => cb( this.allWorkersIds ) );
        }
    }

    private onRejected() {
        const haveErrors = this.allErrors.length > 0,
            haveAllFailedCallbacks = this.allFailedCallbacks.length > 0;

        if ( haveErrors && haveAllFailedCallbacks ) {
            this.allFailedCallbacks.forEach(
                cb => cb( this.allErrors )
            );
        }
    }

    private then( onFulfilled?: { ( value: void ): any }, onRejected?: { ( error: Error ): void } ) {
        this.execution = this.task( this.taskUnit, this ).then(
            this.onFulfilled.bind( this ),
            this.onRejected.bind( this )
        );

        return this.execution.then(
            onFulfilled,
            onRejected
        );
    }
}
