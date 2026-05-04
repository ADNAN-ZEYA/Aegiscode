export function getRazorpayConfig() {
  return {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
    hasSecret: Boolean(process.env.RAZORPAY_KEY_SECRET),
  };
}

export function hasRazorpayConfig() {
  return Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}
