interface SlackAuthTestResponse {
    ok: boolean
    team_id?: string
    team?: string
    error?: string
}

interface SlackConnectionStatus {
    is_connected: boolean
    team_name?: string
    team_id?: string
}

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
})

export const slackService = {
    /**
     * Check if Slack is connected for the current client
     */
    async checkConnection(): Promise<SlackConnectionStatus> {
        const response = await fetch('/api/v1/slack/check_connection/', {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error('Failed to check Slack connection')
        }

        return await response.json()
    },

    /**
     * Verify Slack token with Slack API and get team info
     */
    async verifyToken(token: string): Promise<SlackAuthTestResponse> {
        const response = await fetch('https://slack.com/api/auth.test', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        if (!response.ok) {
            throw new Error('Failed to verify Slack token')
        }

        return await response.json()
    },

    /**
     * Add Slack token and team ID to the backend
     */
    async addToken(slackToken: string, teamId: string): Promise<SlackConnectionStatus> {
        const response = await fetch('/api/v1/slack/add_token/', {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                slack_token: slackToken,
                team_id: teamId,
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to add Slack token')
        }

        return await response.json()
    },

    /**
     * Disconnect Slack integration
     */
    async disconnect(): Promise<{ message: string }> {
        const response = await fetch('/api/v1/slack/disconnect/', {
            method: 'POST',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to disconnect Slack')
        }

        return await response.json()
    }
}

export type { SlackAuthTestResponse, SlackConnectionStatus }
