/**
 * SMS Service for School ERP
 * Supports multiple SMS gateways popular in Pakistan
 * - Twilio (International)
 * - Zong SMS Gateway
 * - Jazz SMS Gateway
 * - Telenor SMS Gateway
 * - Custom HTTP API
 */

export type SMSProvider = 'twilio' | 'zong' | 'jazz' | 'telenor' | 'custom'

export interface SMSConfig {
    provider: SMSProvider
    apiKey?: string
    apiSecret?: string
    senderId?: string
    baseUrl?: string
    username?: string
    password?: string
}

export interface SMSMessage {
    to: string | string[] // Phone number(s)
    message: string
    scheduledAt?: Date
}

export interface SMSResult {
    success: boolean
    messageId?: string
    error?: string
    sentTo: string
    timestamp: Date
}

export interface BulkSMSResult {
    totalSent: number
    totalFailed: number
    results: SMSResult[]
}

// SMS Templates for common scenarios
export const SMS_TEMPLATES = {
    ABSENCE_ALERT: (studentName: string, date: string, schoolName: string) =>
        `Dear Parent, Your child ${studentName} was marked ABSENT on ${date}. Please contact ${schoolName} if this is incorrect.`,

    LATE_ALERT: (studentName: string, date: string, time: string) =>
        `Dear Parent, Your child ${studentName} arrived LATE at ${time} on ${date}.`,

    FEE_REMINDER: (studentName: string, amount: string, dueDate: string) =>
        `Fee Reminder: ${studentName}'s fee of Rs.${amount} is due on ${dueDate}. Please pay to avoid late fee.`,

    EXAM_SCHEDULE: (examName: string, startDate: string) =>
        `${examName} exams will begin from ${startDate}. Please ensure regular attendance and preparation.`,

    GENERAL_ANNOUNCEMENT: (schoolName: string, message: string) =>
        `[${schoolName}] ${message}`,

    PTM_NOTICE: (date: string, time: string) =>
        `Parent Teacher Meeting scheduled for ${date} at ${time}. Your presence is requested.`,

    HOLIDAY_NOTICE: (reason: string, fromDate: string, toDate: string) =>
        `School Holiday: ${reason}. School will remain closed from ${fromDate} to ${toDate}.`,
}

class SMSService {
    private config: SMSConfig | null = null

    configure(config: SMSConfig) {
        this.config = config
    }

    private formatPhoneNumber(phone: string): string {
        // Remove all non-digits
        let cleaned = phone.replace(/\D/g, '')

        // Handle Pakistani numbers
        if (cleaned.startsWith('0')) {
            cleaned = '92' + cleaned.substring(1)
        } else if (!cleaned.startsWith('92') && cleaned.length === 10) {
            cleaned = '92' + cleaned
        }

        return '+' + cleaned
    }

    async send(message: SMSMessage): Promise<SMSResult> {
        if (!this.config) {
            return {
                success: false,
                error: 'SMS service not configured',
                sentTo: Array.isArray(message.to) ? message.to[0] : message.to,
                timestamp: new Date(),
            }
        }

        const phone = this.formatPhoneNumber(
            Array.isArray(message.to) ? message.to[0] : message.to
        )

        try {
            switch (this.config.provider) {
                case 'twilio':
                    return await this.sendViaTwilio(phone, message.message)
                case 'zong':
                case 'jazz':
                case 'telenor':
                    return await this.sendViaPakistaniGateway(phone, message.message)
                case 'custom':
                    return await this.sendViaCustomAPI(phone, message.message)
                default:
                    // Mock send for development
                    return this.mockSend(phone, message.message)
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                sentTo: phone,
                timestamp: new Date(),
            }
        }
    }

    async sendBulk(messages: SMSMessage[]): Promise<BulkSMSResult> {
        const results: SMSResult[] = []
        let totalSent = 0
        let totalFailed = 0

        for (const message of messages) {
            const phones = Array.isArray(message.to) ? message.to : [message.to]

            for (const phone of phones) {
                const result = await this.send({ ...message, to: phone })
                results.push(result)

                if (result.success) {
                    totalSent++
                } else {
                    totalFailed++
                }

                // Add small delay to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 100))
            }
        }

        return { totalSent, totalFailed, results }
    }

    // Send absence alert to parent
    async sendAbsenceAlert(
        parentPhone: string,
        studentName: string,
        date: string,
        schoolName: string
    ): Promise<SMSResult> {
        const message = SMS_TEMPLATES.ABSENCE_ALERT(studentName, date, schoolName)
        return this.send({ to: parentPhone, message })
    }

    // Send late arrival alert
    async sendLateAlert(
        parentPhone: string,
        studentName: string,
        date: string,
        time: string
    ): Promise<SMSResult> {
        const message = SMS_TEMPLATES.LATE_ALERT(studentName, date, time)
        return this.send({ to: parentPhone, message })
    }

    // Send bulk announcement
    async sendAnnouncement(
        phones: string[],
        schoolName: string,
        announcement: string
    ): Promise<BulkSMSResult> {
        const message = SMS_TEMPLATES.GENERAL_ANNOUNCEMENT(schoolName, announcement)
        return this.sendBulk([{ to: phones, message }])
    }

    private async sendViaTwilio(phone: string, message: string): Promise<SMSResult> {
        // Twilio integration
        const accountSid = this.config?.apiKey
        const authToken = this.config?.apiSecret
        const from = this.config?.senderId

        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
                },
                body: new URLSearchParams({
                    To: phone,
                    From: from || '',
                    Body: message,
                }),
            }
        )

        const data = await response.json()

        return {
            success: response.ok,
            messageId: data.sid,
            error: data.message,
            sentTo: phone,
            timestamp: new Date(),
        }
    }

    private async sendViaPakistaniGateway(phone: string, message: string): Promise<SMSResult> {
        // Generic Pakistani SMS Gateway integration
        const response = await fetch(this.config?.baseUrl || '', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.config?.username,
                password: this.config?.password,
                sender: this.config?.senderId,
                mobile: phone,
                message: message,
            }),
        })

        const data = await response.json()

        return {
            success: data.status === 'success' || data.code === 0,
            messageId: data.messageId || data.id,
            error: data.error || data.message,
            sentTo: phone,
            timestamp: new Date(),
        }
    }

    private async sendViaCustomAPI(phone: string, message: string): Promise<SMSResult> {
        const response = await fetch(this.config?.baseUrl || '', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config?.apiKey}`,
            },
            body: JSON.stringify({
                to: phone,
                message: message,
                sender_id: this.config?.senderId,
            }),
        })

        const data = await response.json()

        return {
            success: response.ok,
            messageId: data.id,
            error: data.error,
            sentTo: phone,
            timestamp: new Date(),
        }
    }

    private mockSend(phone: string, message: string): SMSResult {
        console.log(`[SMS Mock] To: ${phone}, Message: ${message}`)
        return {
            success: true,
            messageId: `mock_${Date.now()}`,
            sentTo: phone,
            timestamp: new Date(),
        }
    }
}

// Export singleton instance
export const smsService = new SMSService()

// Export class for testing
export { SMSService }
