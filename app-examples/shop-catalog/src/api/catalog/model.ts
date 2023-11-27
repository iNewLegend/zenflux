import { BehaviorSubject } from "rxjs";

export interface ICatalogPaginationData {
    current: number;
    pages: number;
    perPage: number,
    total: number,
}

export interface ICatalogResponse {
    result: ICatalogItem[];
    pagination: ICatalogPaginationData;
}

export interface ICatalogItem {
    id: number;
    name?: string;
    price?: number;
    amount?: number;
}

export interface ICatalogState {
    items: ICatalogItem[];
    pagination: ICatalogPaginationData;
    prevPage: number;
}

const initialState: ICatalogState = {
    items: [],
    pagination: {} as ICatalogPaginationData,
    prevPage: 0,
};

export const catalogSubject = new BehaviorSubject<ICatalogState>( initialState );

export const catalogState = catalogSubject.asObservable();


// Research * about https://react-rxjs.org/
// https://www.youtube.com/watch?v=Urv82SGIu_0&list=PLw5h0DiJ-9PAXbn39FwGwvkSDR3WBeUFY
// The Flux Architectural
// https://github.com/web-perf/react-worker-dom/tree/master
