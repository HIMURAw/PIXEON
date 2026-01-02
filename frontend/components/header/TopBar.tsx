export default function TopBar() {
    return (
        <>
            <div className="hidden md:block bg-sky-500 text-white text-sm text-center py-2 font-semibold">
                Sitemize özel indirimlerle alışveriş yapın! Tüm siparişlerde ücretsiz kargo fırsatını kaçırmayın.
            </div>

            <div className="md:hidden bg-sky-500 text-white text-xs text-center py-2 font-semibold px-3">
                Ücretsiz kargo fırsatı! Kaçırma.
            </div>
        </>
    );
}
