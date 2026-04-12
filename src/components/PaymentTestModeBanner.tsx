const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN || "pk_test_51TLNagJBWyWZp8IKOYGVhzkbhgVihnlWr907utDyzoWrc5VWDGwywGqu2zU1Rg2qAUtXbg4QtO1m1wJqWnfkVfDA00AaeEHL0V";

export function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("pk_test_")) return null;

  return (
    <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800">
      Todos os pagamentos na preview estão em modo de teste.{" "}
      <a
        href="https://docs.lovable.dev/features/payments#test-and-live-environments"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium"
      >
        Saber mais
      </a>
    </div>
  );
}
