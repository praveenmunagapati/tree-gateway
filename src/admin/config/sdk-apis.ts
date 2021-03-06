'use strict';

import { ApiConfig } from '../../config/api';

export interface Apis {
    list(filters: any): Promise<Array<ApiConfig>>;
    addApi(api: ApiConfig): Promise<string>;
    updateApi(id: string, api: ApiConfig): Promise<void>;
    removeApi(id: string): Promise<void>;
    getApi(id: string): Promise<ApiConfig>;
}

export class ApisClient implements Apis {
    private swaggerClient: any;

    constructor(swaggerClient: any) {
        this.swaggerClient = swaggerClient;
    }

    list(filters: any): Promise<Array<ApiConfig>> {
        return new Promise<Array<ApiConfig>>((resolve, reject) => {
            this.swaggerClient.apis.APIs.APIRestList(filters)
                .then((response: any) => {
                    if (response.status === 200) {
                        return resolve(response.body);
                    }
                    reject(new Error(response.text));
                })
                .catch(reject);
        });
    }

    addApi(api: ApiConfig): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.swaggerClient.apis.APIs.APIRestAddApi({ api })
                .then((response: any) => {
                    if (response.status === 201) {
                        return resolve(response.headers['location'].substring(5));
                    }
                    reject(new Error(response.text));
                })
                .catch(reject);
        });
    }

    updateApi(id: string, api: ApiConfig): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!id) {
                return reject(new Error('Invalid API id. To update an API, you must provide a valid ID field'));
            }
            api.id = id;
            this.swaggerClient.apis.APIs.APIRestUpdateApi({ id, api })
                .then((response: any) => {
                    if (response.status === 204) {
                        return resolve();
                    }
                    reject(new Error(response.text));
                })
                .catch(reject);
        });
    }

    removeApi(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!id) {
                return reject(new Error('Invalid API id. To remove an API, you must provide a valid ID'));
            }
            this.swaggerClient.apis.APIs.APIRestRemoveApi({ id })
                .then((response: any) => {
                    if (response.status === 204) {
                        return resolve();
                    }
                    reject(new Error(response.text));
                })
                .catch(reject);
        });
    }

    getApi(id: string): Promise<ApiConfig> {
        return new Promise<ApiConfig>((resolve, reject) => {
            if (!id) {
                return reject(new Error('Invalid API id. To retrieve an API, you must provide a valid ID'));
            }
            this.swaggerClient.apis.APIs.APIRestGetApi({ id })
                .then((response: any) => {
                    if (response.status === 200) {
                        return resolve(response.body);
                    }
                    reject(new Error(response.text));
                })
                .catch(reject);
        });
    }
}
