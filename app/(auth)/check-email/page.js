export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-darkSecondary flex items-center justify-center p-4">
      <div className="bg-darkPrimary rounded-lg shadow-lg shadow-darkSecondary/50 p-8 w-full max-w-md">
        <div className="text-center space-y-6">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-2xl font-bold text-darkText">Check your email</h1>
          <p className="text-darkTextSecondary">
            We've sent a magic link to your email address. Click the link to
            sign in.
          </p>
          <div className="animate-pulse text-darkTextSecondary text-sm">
            Waiting for you to verify...
          </div>
        </div>
      </div>
    </div>
  );
}
