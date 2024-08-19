// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  // websocketUrl: 'ws://137.184.65.180:9094/',
  urlHost: 'http://167.99.237.35:9094/',
  // urlApi: '137.184.65.180:9094/auth/v1/signin',
  websocketUrl: 'ws://localhost:8080/',
  // urlHost: 'http://localhost:8080/',
  urlApi: 'http://localhost:8080/auth/v1/signin',
  islogged:false,
  username:'',
  nombre:'',
  apellido:'',
  cedula:''
};
