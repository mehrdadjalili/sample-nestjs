export const allConfig = () => ({
  smtp: <SmtpConfig>{
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
  jwt: <JwtConfig>{
    secret: process.env.JWT_SECRET,
    refresh_expire_time: 60*60*24*30,
    access_expire_time: 60*60,
  },
});

export interface SmtpConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  from: string;
}

export interface JwtConfig {
  secret: string;
  refresh_expire_time: number,
  access_expire_time: number,
}
