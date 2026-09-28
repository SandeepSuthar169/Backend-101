import express from 'express';
import type { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/notes', (req: Request, res: Response) => {
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
