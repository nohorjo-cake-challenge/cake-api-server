import express from 'express';
import cors from 'cors';

import routes from './routes';

const app = express();

app.use(
    cors(),
    express.json(),
    routes,
);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started');
})
