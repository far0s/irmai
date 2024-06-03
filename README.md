# irmai

> irmai is a tarot-reading webapp experience, using AI in lieu of a human reader.

## Team

- Seb Dancer-Michel
- AJ Marshall
- Sunniva Ottestad
- Zelda Colombo

## Tech stack

- Next.js/React
- vercel/ai
- tarot-api

## .env

You will need an `.env` file in the root of the project with an `OPENAI_API_KEY` and an `ELEVEN_LABS_API_KEY`. You can either use your own (get one here https://platform.openai.com/api-keys, same thing for ElevenLabs) or pull the one we're using from Vercel (you will have to link your local project to the Vercel project fist):
```bash
vercel env pull
```

```

## Installation/local development

1. Clone the repo
2. `npm install`
3. `npm run dev`
4. Visit `https://localhost:3000` (next will generate a local SSL certificate for you)
5. Enjoy!

Every commit triggers a deployment to Vercel, so you can see the latest changes at [irmai.vercel.app](https://irmai.vercel.app).
If you commit inside of a branch, it will be deployed to a preview URL.
If you commit to the `main` branch, it will be deployed to the main URL.


## TODO: complete this README
