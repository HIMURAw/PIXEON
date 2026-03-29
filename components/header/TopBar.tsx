export default function TopBar() {
    return (
        <>
            <div className="hidden md:block bg-sky-500 text-white text-sm text-center py-2 font-semibold">
                Shop with exclusive discounts on our website! Free shipping on all orders.
            </div>

            <div className="md:hidden bg-sky-500 text-white text-xs text-center py-2 font-semibold px-3">
                Free shipping! Don't miss out!
            </div>
        </>
    );
}
