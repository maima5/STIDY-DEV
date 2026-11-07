import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => console.log(`S-Tidy API jalan di http://localhost:${env.PORT}/api`));
