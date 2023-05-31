import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [textInput, setTextInput] = useState('');
  const [qttInput, setQttInput] = useState('');
  const [result, setResult] = useState([]);
  const [apiKey, setApiKey] = useState('');

  const handleChangeApiKey = ({target}) => {
    setApiKey(target.value);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey, text: textInput, quantity: parseInt(qttInput) }),
      });

      const data = await response.json();
      localStorage.setItem('apiKey', JSON.stringify(apiKey));
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setTextInput('');
      setQttInput('');
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  useEffect(() => {
    const key = JSON.parse(localStorage.getItem('apiKey'));
    if (!key) {
      setApiKey('')
    } else {
      setApiKey(key)
    }
  }, []);

  return (
    <div>
      <Head>
        <title>image generator</title>
        <link rel="icon" href="/cat.png" />
      </Head>

      <main className={styles.main}>
        <img src="/cat.png" className={styles.icon} />
        <h3>image generator</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="apiKey"
            placeholder="api key"
            value={apiKey}
            onChange={handleChangeApiKey}
          />
          <input
            type="text"
            name="text"
            placeholder="type to generate image"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <input
          type="number"
          name="text"
          placeholder="quantity of images: between 1 and 10"
          value={qttInput}
          onChange={(e) => setQttInput(e.target.value)}
          />
          <input type="submit" value="Generate images" />
        </form>

        {result.map((e) => <a key={e} href={e}><img src={e} alt={e} /></a>)}
      </main>
    </div>
  );
}
