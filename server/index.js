import { createCloudServer } from "./app.js";

const port = Number(process.env.PORT ?? 8787);
const app = createCloudServer();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`CyberGame cloud server running on http://localhost:${port}`);
});
