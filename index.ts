import app from './server';

app.listen(process.env.PORT || 3001, () => {
    console.log('Server started');
});
