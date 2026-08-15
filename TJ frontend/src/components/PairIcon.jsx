import { TokenIcon } from "@web3icons/react/dynamic";
import { FiDollarSign } from "react-icons/fi";
import "flag-icons/css/flag-icons.min.css";

const currencyCountries = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    JPY: "jp",
    AUD: "au",
    CAD: "ca",
    CHF: "ch",
    NZD: "nz",
    CNY: "cn",
    HKD: "hk",
    SGD: "sg",
    SEK: "se",
    NOK: "no",
    DKK: "dk",
    PLN: "pl",
    CZK: "cz",
    HUF: "hu",
    TRY: "tr",
    ZAR: "za",
    MXN: "mx",
    BRL: "br",
    INR: "in",
};

const cryptoQuoteCurrencies = [
    "USDT",
    "USDC",
    "BUSD",
    "FDUSD",
    "TUSD",
    "DAI",
    "USD",
    "EUR",
];

function normalizePair(pair) {
    return pair?.toUpperCase().replace(/[^A-Z]/g, "");
}

function getCryptoBase(pair) {
    const quote = cryptoQuoteCurrencies.find((currency) =>
        pair.endsWith(currency)
    );

    return quote
        ? pair.slice(0, -quote.length)
        : pair;
}

function FxFlags({ base, quote }) {
    const baseCountry = currencyCountries[base];
    const quoteCountry = currencyCountries[quote];

    if (!baseCountry || !quoteCountry) {
        return <FiDollarSign size={36} />;
    }

    return (
        <span
            className="fx-pair-flags"
            style={{
                position: "relative",
                width: "24px",
                height: "24px",
                display: "block",
                flexShrink: 0,
            }}
        >
            {/* Quote currency — upper right */}
            <span
                className={`fi fi-${quoteCountry} fx-flag`}
                style={{
                    position: "absolute",
                    width: "13px",
                    height: "13px",
                    top: "0",
                    right: "0",
                    zIndex: 1,
                }}
            />

            {/* Base currency — lower left */}
            <span
                className={`fi fi-${baseCountry} fx-flag`}
                style={{
                    position: "absolute",
                    width: "13px",
                    height: "13px",
                    top: "10px",
                    left: "0",
                    zIndex: 2,
                }}
            />
        </span>
    );
}

function PairIcon({ pair, size = 36 }) {
    const normalizedPair = normalizePair(pair);

    if (!normalizedPair) {
        return <FiDollarSign size={size} />;
    }

    // FX: EURUSD, GBPJPY, AUDCAD, etc.
    if (normalizedPair.length === 6) {
        const base = normalizedPair.slice(0, 3);
        const quote = normalizedPair.slice(3, 6);

        if (
            currencyCountries[base] &&
            currencyCountries[quote]
        ) {
            return (
                <FxFlags
                    base={base}
                    quote={quote}
                />
            );
        }
    }

    // Crypto: BTCUSDT, ETHUSDT, SOLUSDT, etc.
    const baseSymbol = getCryptoBase(normalizedPair);

    if (baseSymbol) {
        return (
            <TokenIcon
                symbol={baseSymbol}
                size={size}
                variant="branded"
                fallback={<FiDollarSign size={size} />}
            />
        );
    }

    return <FiDollarSign size={size} />;
}

export default PairIcon;