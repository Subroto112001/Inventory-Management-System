import VerifyEmailForm from "./VerifyEmailForm";

export default async function VerifyEmailPage({ searchParams }) {
  const params = await searchParams;
  const email = typeof params?.email === "string" ? params.email : "";
  const sendFailed = params?.sendFailed === "1";
  const expiresAt = Number(params?.expiresAt) || 0;
  const resendAt = Number(params?.resendAt) || 0;
  return <VerifyEmailForm initialEmail={email} sendFailed={sendFailed} hasOtpExpiry={Boolean(expiresAt) && !sendFailed} otpExpiresAt={expiresAt} resendAt={sendFailed ? 0 : resendAt} />;
}
