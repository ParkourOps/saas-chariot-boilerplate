import SendTemplatedEmail from "@/_common_/features/email-messaging/api/SendTemplatedEmail"
import SendTextOnlyEmail from "@/_common_/features/email-messaging/api/SendTextOnlyEmail"
import functionCallerFactory from "@/framework/libraries/function-caller-factory"

export default {
    sendTemplatedEmail: functionCallerFactory.createFunctionCaller(SendTemplatedEmail),
    sendTextOnlyEmail: functionCallerFactory.createFunctionCaller(SendTextOnlyEmail),
}
