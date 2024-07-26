// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  websocketUrl: 'ws://134.209.113.34:9094/',
  urlHost: 'http://134.209.113.34:9094/',
  urlApi: 'http://134.209.113.34:9094/auth/v1/signin',
  userId:1,
  islogged:false,
  username:'',
  nombre:'',
  apellido:'',
  cedula:''
};
