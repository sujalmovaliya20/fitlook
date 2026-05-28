import { Client } from "@gradio/client";

async function run() {
  const client = await Client.connect("yisol/IDM-VTON");
  console.log(JSON.stringify(await client.view_api(), null, 2));
}
run();
