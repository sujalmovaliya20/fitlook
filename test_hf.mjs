import { Client } from "@gradio/client";

async function run() {
  try {
    const client = await Client.connect("multimodalart/cosxl");
    const info = await client.view_api();
    console.log(JSON.stringify(info, null, 2));
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
