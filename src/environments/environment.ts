// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



export const environment = {
  production: false,
  base_url: 'http://localhost:4251/api',

  s3: {
    accessKeyId: 'AKIAJZVNWTXCJUO6YVSA',
    secretAccessKey: '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',
    region: 'us-east-2',
    bucket: 'preshent',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
