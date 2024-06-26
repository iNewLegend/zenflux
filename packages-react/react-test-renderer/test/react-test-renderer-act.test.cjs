jest.useRealTimers();

let React;
let ReactTestRenderer;
let Scheduler;
let act;
let assertLog;

describe( 'ReactTestRenderer.act()', () => {
    beforeEach( () => {
        jest.resetModules();

        if ( globalThis.globalThis.__Z_CUSTOM_LOADER__ !== undefined ) {
            globalThis.__Z_CUSTOM_LOADER_DATA__ = {};
            globalThis.__Z_CUSTOM_LOADER_MODULE_FORWARDING_EXPECT_DUPLICATE__[ "@zenflux/react-test-renderer"] = true;
        }

        React = require( 'react' );
        ReactXEnvHooks = require( '@zenflux/react-x-env/hooks' );
        ReactTestRenderer = require( '@zenflux/react-test-renderer' );
        Scheduler = require( '@zenflux/react-scheduler/mock' );
        act = ReactTestRenderer.act;

        const InternalTestUtils = require( '@zenflux/react-internal-test-utils' );
        assertLog = InternalTestUtils.assertLog;
    } );

    // @gate __DEV__
    it( 'can use .act() to flush effects', () => {
        function App( props ) {
            const [ ctr, setCtr ] = ReactXEnvHooks.useState( 0 );
            React.useEffect( () => {
                props.callback();
                setCtr( 1 );
            }, [] );
            return ctr;
        }

        const calledLog = [];
        let root;
        act( () => {
            root = ReactTestRenderer.create(
                <App
                    callback={ () => {
                        calledLog.push( calledLog.length );
                    } }
                />,
            );
        } );

        expect( calledLog ).toEqual( [ 0 ] );
        expect( root.toJSON() ).toEqual( '1' );
    } );

    describe( 'async', () => {
        // @gate __DEV__
        it( 'should work with async/await', async () => {
            function fetch( url ) {
                return Promise.resolve( {
                    details: [ 1, 2, 3 ],
                } );
            }

            function App() {
                const [ details, setDetails ] = ReactXEnvHooks.useState( 0 );

                ReactXEnvHooks.useEffect( () => {
                    async function fetchDetails() {
                        const response = await fetch();
                        setDetails( response.details );
                    }

                    fetchDetails();
                }, [] );
                return details;
            }

            let root;

            await ReactTestRenderer.act( async () => {
                root = ReactTestRenderer.create( <App/> );
            } );

            expect( root.toJSON() ).toEqual( [ '1', '2', '3' ] );
        } );

        // @gate __DEV__
        it( 'should not flush effects without also flushing microtasks', async () => {
            const { useEffect, useReducer } = ReactXEnvHooks;

            const alreadyResolvedPromise = Promise.resolve();

            function App() {
                // This component will keep updating itself until step === 3
                const [ step, proceed ] = useReducer( s => ( s === 3 ? 3 : s + 1 ), 1 );
                useEffect( () => {
                    Scheduler.log( 'Effect' );
                    alreadyResolvedPromise.then( () => {
                        Scheduler.log( 'Microtask' );
                        proceed();
                    } );
                } );
                return step;
            }

            const root = ReactTestRenderer.create( null );
            await act( async () => {
                root.update( <App/> );
            } );
            assertLog( [
                // Should not flush effects without also flushing microtasks
                // First render:
                'Effect',
                'Microtask',
                // Second render:
                'Effect',
                'Microtask',
                // Final render:
                'Effect',
                'Microtask',
            ] );
            expect( root ).toMatchRenderedOutput( '3' );
        } );
    } );
} );
