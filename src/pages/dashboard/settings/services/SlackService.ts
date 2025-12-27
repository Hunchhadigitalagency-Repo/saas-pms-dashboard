import axios from 'axios'
import { BASE_URL } from '@/core/api/constant'

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

const getBaseUrl = () => {
    const domainsString = localStorage.getItem('domains')
    if (domainsString) {
        try {
            const domains = JSON.parse(domainsString)
            const primaryDomain = domains?.domain || domains?.[0]?.domain
            if (primaryDomain) {
                return `https://${primaryDomain}/api/v1`
            }
        } catch (error) {
            console.error('Error parsing domains:', error)
        }
    }
    // Fallback to BASE_URL constant
    return BASE_URL
}

export const slackService = {
    /**
     * Check if Slack is connected for the current tenant
     */
    async checkConnection(): Promise<SlackConnectionStatus> {
        const baseUrl = getBaseUrl()
        try {
            const response = await axios.get(`${baseUrl}/slack/check_connection/`, {
                withCredentials: true,
            })
            return response.data
        } catch (error) {
            console.error('Failed to check Slack connection:', error)
            throw error
        }
    },

    /**
     * Verify Slack token with backend API
     * Backend will verify with Slack and return team info
     */
    async verifyToken(token: string): Promise<SlackAuthTestResponse> {
        const baseUrl = getBaseUrl()
        try {
            const response = await axios.post(
                `${baseUrl}/slack/verify_token/`,
                {
                    slack_token: token,
                },
                {
                    withCredentials: true,
                }
            )
            return response.data
        } catch (error) {
            console.error('Failed to verify Slack token:', error)
            throw error
        }
    },

    /**
     * Add Slack token and team ID to the backend
     */
    async addToken(slackToken: string, teamId: string): Promise<SlackConnectionStatus> {
        const baseUrl = getBaseUrl()
        try {
            const response = await axios.post(
                `${baseUrl}/slack/add_token/`,
                {
                    slack_token: slackToken,
                    team_id: teamId,
                },
                {
                    withCredentials: true,
                }
            )
            return response.data
        } catch (error) {
            console.error('Failed to add Slack token:', error)
            throw error
        }
    },

    /**
     * Disconnect Slack integration
     */
    async disconnect(): Promise<{ message: string }> {
        const baseUrl = getBaseUrl()
        try {
            const response = await axios.post(
                `${baseUrl}/slack/disconnect/`,
                {},
                {
                    withCredentials: true,
                }
            )
            return response.data
        } catch (error) {
            console.error('Failed to disconnect Slack:', error)
            throw error
        }
    }
}

export type { SlackAuthTestResponse, SlackConnectionStatus }
