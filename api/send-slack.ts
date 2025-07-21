import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
    api: {
        bodyParser: true,
    },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end('Only POST requests allowed')
    }

    const { text } = req.body

    if (!text) {
        return res.status(400).json({ error: "Missing 'text' field in request body." })
    }

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!slackWebhookUrl) {
        return res.status(500).json({ error: 'Missing SLACK_WEBHOOK_URL in env variables.' })
    }

    try {
        const response = await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            return res.status(500).json({ error: 'Slack Error', detail: errorText })
        }

        return res.status(200).json({ success: true })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
}
