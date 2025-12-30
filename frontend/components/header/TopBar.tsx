export default function TopBar() {
    return (
        <>
            <div className="hidden md:block bg-blue-900 text-white text-sm text-center py-2 font-bold">
                Sitemize özel indirimlerle alışveriş yapın! Tüm siparişlerde ücretsiz kargo fırsatını kaçırmayın.
            </div>

            <div className="md:hidden bg-blue-900 text-white text-xs text-center py-2 font-bold px-3">
                Ücretsiz kargo fırsatı! Kaçırma.
            </div>
        </>
    );
}
