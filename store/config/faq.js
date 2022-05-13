export const state = () => ({
  faq_items: [
    {
      category: "getting_started",
      question: "Can I cancel a cryptocurrency transaction?",
      answer:
        "Due to the nature of digital currency protocols, transactions cannot be cancelled or altered once they are initiated. This is what allows merchants to accept digital currency without the risk of chargebacks. It also means users must be careful when they send funds, as transactions cannot be undone, outside of asking the recipient for a refund.",
    },
    {
      category: "getting_started",
      question:
        "Why do cryptocurrencies change value? Why is the price volatile?",
      answer:
        "Cryptourrency value can be volatile when compared to more established currencies and commodities. This can be attributed to its relatively small market size, and it means that a smaller amount of money can move cryptourrency prices more significantly.",
    },
    {
      category: "getting_started",
      question: "What is Bitcoin?",
      answer:
        "Bitcoin is a new kind of money that can be sent from one person to another without the need for a trusted third party such as a bank or other financial institution; it is the first global, decentralized currency.",
    },
    {
      category: "getting_started",
      question: "What is Bitcoin, the technology?",
      answer:
        "Bitcoin was originally released in 2009 by Satoshi Nakamoto as a piece of software and a paper describing how it works. Because Bitcoin is fundamentally software, anybody can run it on their computer, and therefore participate in a global economy. One of the most important elements of Bitcoin is the blockchain, which tracks who owns what, similar to how a bank tracks assets. What sets the Bitcoin blockchain apart from a bank's ledger is that it is distributed, meaning anyone can view it. Since Bitcoin is open, no company, country, or third party is in control of it, and anyone can participate.",
    },
    {
      category: "getting_started",
      question: "What is bitcoin, the currency?",
      answer:
        "One can use bitcoins to purchase goods on the internet and in stores. The following are some unique properties of Bitcoin: Bitcoin is global: Bitcoins can be sent to someone across the world as easily as one can pass cash across the counter. Bitcoin isn't closed on weekends and doesn't  impose any arbitrary limits. Bitcoin is irreversible: Bitcoin is like cash in that transactions cannot be reversed by the sender. In comparison, credit card, popular online payment systems, and banking transactions can be reversed after the payment has been made - sometimes months after the initial transaction. Bitcoin is private: When paying with bitcoins, there are no bank statements, and one need not provide unnecessary personal information to the merchant. Bitcoin transactions do not contain any identifying information other than the bitcoin addresses and amounts involved. Bitcoin is secure: Due to the cryptographic nature of the Bitcoin network, Bitcoin payments are fundamentally more secure than standard debit/credit card transactions. When making a Bitcoin payment, no sensitive information is required to be sent over the internet. There is very low risk of your financial information being compromised, or having your identity stolen. Bitcoin is open: Every transaction on the Bitcoin network is published publicly, without exception. This means there's no room for manipulation of transactions, changing the money supply, or adjusting the rules mid-game. The software that constitutes the core of Bitcoin is free and open-source so anyone can review the code. Bitcoins themselves are not files stored on your computer's hard drive like MP3s or PDFs. Rather 'owning bitcoins', means owning a bitcoin address, which has a balance recorded on the blockchain. What it means to own a bitcoin address is to control the associated Private Key, and therefore allow the signing of transactions.",
    },
    {
      category: "getting_started",
      question: "What is a Block?",
      answer:
        "A Block refers to a set of Bitcoin transactions from a certain time period. Blocks are 'stacked' on top of each other in such a way that one block depends on the previous. In this manner, a chain of blocks is created, and thus we come to the term 'blockchain'. Finding and publishing new blocks is what Bitcoin miners do to earn bitcoins. Whenever a new block is broadcast, approximately every 10 minutes, a quantity of bitcoins is received by the miner who solved that block. Bitcoin miners keep the network secure, and this is how they are rewarded. This system ensures that all transactions are valid, and keeps the bitcoin network secure from fraud. If you`ve ever waited for a new bitcoin transaction to be confirmed, you were waiting for a new block to published containing your transaction. When that happens, the bitcoin network has deemed your transaction valid. Alfex currently requires 3 network confirmations before the transaction is considered finalized, however this number will vary with other Bitcoin services.",
    },
    {
      category: "getting_started",
      question: "What is Litecoin?",
      answer:
        "Like Bitcoin, Litecoin exists as a blockchain where participating nodes process transactions, and miners provide security and verification for each of those transactions. Litecoin was originally conceived and developed by Charlie Lee in 2011. Since its launch in 2011 Litecoin has seen steady adoption with an active community of traders, merchants, and developers.",
    },
    {
      category: "privacy_and_security",
      question: "Online Scams",
      answer:
        "Avoiding cryptocurrency scams Cryptocurrency transactions are irreversible, if you send cryptocurrency to a third party, you cannot reverse it or stop payment. When you send cryptocurrency to a blockchain address, you must be certain of the legitimacy of any involved third-party services and merchants, and only send cryptocurrency to entities you trust. Pro tip: If it sounds too good to be true, it probably is.",
    },
    {
      category: "privacy_and_security",
      question: "Giveaway Scams",
      answer:
        "Scammers are using social media to perpetuate giveaway scams. They post screenshots of forged messages from companies and executives promoting a giveaway with hyperlinks to fraudulent websites. Fake accounts will then respond to these posts affirming the scam as legitimate. The fraudulent websites will then ask that you “verify” your address by sending cryptocurrency to the scam giveaway.Alfex Earn is a legitimate method for earning cryptocurrency and any giveaways that Alfex offers will direct you to Alfex.com. Alfex will never ask you to send crypto to an address in order to receive crypto back.",
    },
    {
      category: "privacy_and_security",
      question: "Investment Scams",
      answer:
        "These scammers ask you to invest money to earn higher returns without financial risk, then request you to bring more people in to do the same. They often need a constant flow of new people investing in order to make money. Ponzi and pyramid schemes are great examples of investment scams.For the US, if you come across one of these scams, contact the Securities and Exchange Commission, the Federal Trade Commission, or your state's securities regulator to get help. For the UK, contact the Financial Conduct Authority. Tips for avoiding investment scams:Be skeptical of websites or services promising high returns or unrealistic investment opportunities. If it sounds too good to be true, it usually is.Only send cryptocurrency to trusted third parties. Search for publicly verifiable reviews or articles involving the recipient.Watch for grammatical errors in communications or on websites. Scammers often make grammar or spelling mistakes.Research the organization thoroughly. Check consumer-protection websites and make telephone calls and send emails to verify authenticity.",
    },
    {
      category: "privacy_and_security",
      question: "Extortion Scams",
      answer:
        "Scammers will often use information sourced from data breaches at other websites to trick you into thinking that they have more information about you than they actually do. For example, they might show you an old password that you may have used to affirm that their scam is legitimate.If you are victim of an extortion scam, please immediately take these actions:Report the email as spam to your email provider.  Run a precautionary malware scan on your computer using a reputable tool like Malwarebytes. If you recognize any passwords included in the extortion email as one you currently use, change it immediately across all websites.  Contact your local authorities and file a police report. Have the authorities contact Alfex directly. Alfex is committed to full cooperation in all law-enforcement investigations. While these messages can be alarming, they are almost always fraudulent. For steps you can take to make your account more secure, please see this help page.",
    },
    {
      category: "privacy_and_security",
      question: "Telegram Scams ",
      answer:
        "Alfex has no official presence on the Telegram messaging platform. All varieties of scams can be found on this platform that target Alfex users, including fraudulent payment bots and giveaway scams.Read this blog post for more information on Telegram scams.",
    },
    {
      category: "privacy_and_security",
      question: "Phishing",
      answer:
        "Phishing sites are malicious websites which mimic an authentic site in order to trick visitors into entering their login credentials or other sensitive information. These fraudulent websites are distributed through a variety of methods including email, SMS text messages, social media, and search-engine advertisements.",
    },
    {
      category: "managing_my_account",
      question: "Password Requirements",
      answer:
        "What are the password requirements on Alfex?Passwords must be at least 8 characters long and have an estimated offline crack time over 6,000 seconds.We do not enforce arbitrary restrictions on numbers, special characters, or maximum password length.Any passwords longer than 72 characters will be truncated.",
    },
    {
      category: "managing_my_account",
      question: "How do I choose a good password?",
      answer:
        "Alfex strongly recommends the use of password manager software, such as 1Password or LastPass. A password manager can generate random, unique passwords for each website you visit. It can also automatically fill in passwords for you and can protect you against phishing attacks.",
    },
    {
      category: "managing_my_account",
      question: "If you don't want to use a password manager:",
      answer:
        "Be sure to use a long, random password that is unique to your Alfex account.Do not reuse passwords from other websites, especially your email account.You can use a passphrase (a sentence or group of words), but do not choose a phrase from a book or a movie as hackers have access to sophisticated databases of such quotes.",
    },
    {
      category: "managing_my_account",
      question: "Use a strong password",
      answer:
        "Use a password that is long, random, and unique to your Alfex account. Never use the same password twice across your online accounts! To make it easy on you, here is the password reset link so you can strengthen your password now.We also recommend using a password manager like LastPass, 1Password, or Dashlane to easily generate and securely store unique passwords for all of your online accounts.If you don't want to use a password manager, use a passphrase (a sentence or group of four or more words) for your account. However, be careful and do not choose a phrase from a book or a movie as hackers have access to sophisticated databases of such quotes.For more password related information or to see how strong your current password is, see our Password FAQ.Important Reminder: Never disclose your password to anyone. Alfex employees will NEVER ask for your password.",
    },
    {
      category: "managing_my_account",
      question: "Secure Your Email",
      answer:
        "Your email is one of the most important connections between you and your Alfex account. We use your email to confirm new devices, send you important alerts about your account, and to communicate with you if you need support. Please make sure it is secure!For starters, visit <a>https://haveibeenpwned.com/</a> to see whether or not your email address has ever been compromised in a third-party data breach. If so, we recommend changing any passwords associated with that email address. You should also enable 2-step verification on your personal email account as well.As an additional security precaution, you should conduct a periodic security review of your email account and settings as well:Check your email account for unusual rules, filters, or forwarding addresses.Check your email account settings for authorized devices you do not recognize.Check for unauthorized recovery emails or phone numbers added to the account.For those who feel like they may be at risk of targeted account takeover attempts, check out Google`s Advanced Protection Program.",
    },
    {
      category: "managing_my_account",
      question: "Protect Your Cloud Storage Accounts",
      answer:
        "Many people who use smartphones often make use of cloud storage accounts such as Google Drive or iCloud to create backups of the data saved on their mobile devices. This data often includes messages, contacts, email, apps, photos, and more. If an attacker gains access to your cloud storage account and restores the device backup onto a device in their control, they will have a vast amount of information at their disposal to help them compromise your various online accounts. Do not underestimate the power of an attacker with access to this information!Luckily, you can easily secure and protect your cloud storage accounts by following a few basic guidelines we`ve already covered:Create a strong password! Preferably using a password manager.Secure it with the strongest form of 2-step verification available.",
    },
    {
      category: "managing_my_account",
      question: "Protect your email account.",
      answer:
        "Or if you want to completely avoid the risk of an attacker being able to back up your mobile device data, you can disable backups all together in your cloud`s account settings.",
    },
    {
      category: "managing_my_account",
      question: "Check Your Recent Activity",
      answer:
        "In your Alfex account, visit the Activity page where you can view all of your active sessions including authorized mobile applications, web sessions, and confirmed devices.If at any time you notice an unauthorized application, session, or device, you can revoke access by clicking the blue X to the right. If you need to revoke an unauthorized login to your account that you don't recognize, you should change your Alfex and email passwords immediately. You can also open a customer support ticket explaining the issue so our security team can review your account and help you secure it.",
    },
    {
      category: "managing_my_account",
      question: "Is Bitcoin secure? Has this network ever been hacked?",
      answer:
        "The Bitcoin network and currency has proven to be secure, functional, and efficient. The technology used to build Bitcoin is mathematically secured by the laws of the universe, and is constantly being improved upon by the open-source community. The software is actively inspected, and audited by this growing community.Though there have been Bitcoin-related compromises in the past, this does not reflect upon the security of the Bitcoin network itself. Bitcoin-related thefts are usually the result of improper security or negligence on the part of the person or service holding the bitcoins. If you left your wallet on a park bench and it was stolen, it would not be considered a 'hack' of the dollar. This is why it is important to trust the security practices of any Bitcoin-related service you use.As more stakeholders become interested in the success of Bitcoin, the system will become more secure, as increasingly significant resources are being devoted to closing security holes and thoroughly vetting any proposed changes.As a holder of bitcoin, you have tremendous power over your money. Because of this, it is important to follow good security practices to protect your funds. Since most people are not specifically trained in computer security, Alfex can manage the bulk of these security measures on your behalf.At Alfex, we're committed to security by using industry best practices and storing up to 97% of bitcoins in encrypted, geographically separated, offline storage. To further protect our customers, all of the bitcoins stored in online computers are insured. Digital currency is not legal tender, is not backed by the government, and digital currency accounts and value balances on Alfex are not subject to Federal Deposit Insurance Corporation or Securities Investor Protection Corporation protections. Even with these safeguards provided by Alfex, we recommend you take further measures to secure your account against unauthorized access.",
    },
    {
      category: "what_is_arbitrage",
      question: "WHAT IS ARBITRAGE?",
      answer:
        "Arbitrage is an investment strategy in which an investor simultaneously buys and sells an asset in different markets to take advantage of a price difference and generate a profit. While price differences are typically small and short-lived, the returns can be impressive when multiplied by a large volume. Arbitrage is commonly leveraged by hedge funds and other sophisticated investors.There are several types of arbitrage, including pure arbitrage, merger arbitrage, and convertible arbitrage. Global macro is another investment strategy related to arbitrage, but it’s considered a different approach because it refers to investing in economic changes between countries.",
    },
    {
      category: "what_is_arbitrage",
      question: "Understanding Arbitrage",
      answer:
        "Arbitrage can be used whenever any stock, commodity, or currency may be purchased in one market at a given price and simultaneously sold in another market at a higher price. The situation creates an opportunity for a risk-free profit for the trader.Arbitrage provides a mechanism to ensure that prices do not deviate substantially from fair value for long periods of time. With advancements in technology, it has become extremely difficult to profit from pricing errors in the market. Many traders have computerized trading systems set to monitor fluctuations in similar financial instruments. Any inefficient pricing setups are usually acted upon quickly, and the opportunity is eliminated, often in a matter of seconds.",
    },
    {
      category: "what_is_arbitrage",
      question: "A Simple Arbitrage Example",
      answer:
        "As a straightforward example of arbitrage, consider the following. The stock of Company X is trading at $20 on the New York Stock Exchange (NYSE) while, at the same moment, it is trading for $20.05 on the London Stock Exchange (LSE).A trader can buy the stock on the NYSE and immediately sell the same shares on the LSE, earning a profit of 5 cents per share.The trader can continue to exploit this arbitrage until the specialists on the NYSE run out of inventory of Company X's stock, or until the specialists on the NYSE or LSE adjust their prices to wipe out the opportunity.",
    },
    {
      category: "what_is_arbitrage",
      question: "Why Is Arbitrage Important?",
      answer:
        "In the course of making a profit, arbitrage traders enhance the efficiency of the financial markets.As they buy and sell, the price differences between identical or similar assets narrow. The lower-priced assets are bid up while the higher-priced assets are sold off. In this manner, arbitrage resolves inefficiencies in the market`s pricing and adds liquidity to the market.",
    },
    {
      category: "what_is_leverage",
      question: "What Is Leverage?",
      answer:
        "Leverage results from using borrowed capital as a funding source when investing to expand the firm's asset base and generate returns on risk capital.Leverage is an investment strategy of using borrowed money—specifically, the use of various financial instruments or borrowed capital—to increase the potential return of an investment.",
    },
    {
      category: "what_is_leverage",
      question: "Understanding Leverage",
      answer:
        "Leverage is the use of debt (borrowed capital) in order to undertake an investment or project.The result is to multiply the potential returns from a project. At the same time, leverage will also multiply the potential downside risk in case the investment does not pan out. When one refers to a company, property, or investment as 'highly leveraged', it means that item has more debt than equity.",
    },
    {
      category: "what_is_leverage",
      question: "Leverage vs. Margin",
      answer:
        "Margin is a special type of leverage that involves using existing cash or securities position as collateral used to increase one's buying power in financial markets.Margin allows you to borrow money from a broker for a fixed interest rate to purchase securities, options, or futures contracts in the anticipation of receiving substantially high returns.3You can thus use margin to create leverage, increasing your buying power by the marginable amount—for instance, if the collateral required to purchases $10,000 worth of securities is $1,000 you would have a 1:10 margin (and 10x leverage).",
    },
    {
      category: "what_is_leverage",
      question: "Example of Leverage",
      answer:
        "A company was formed with a $5 million investment from investors, where the equity in the company is $5 million—this is the money the company can use to operate. If the company uses debt financing by borrowing $20 million, it now has $25 million to invest in business operations and more opportunity to increase value for shareholders.An automaker, for example, could borrow money to build a new factory. The new factory would enable the automaker to increase the number of cars it produces and increase profits.",
    },
    {
      category: "what_is_crypto",
      question: "What are cryptocurrencies?",
      answer:
        "This is a seemingly simple question, but since most people answer about what they think, hope, or want cryptocurrencies to be, it is a confusing one. Cryptocurrencies are a digital asset that started as a medium of exchange for people to buy goods and services. Over time, their functionality has expanded.",
    },
    {
      category: "what_is_crypto",
      question:
        "Beyond a method for payment, what are other functions of cryptocurrencies? ",
      answer:
        "Cryptocurrency value can be pegged to underlying asset such as U.S. dollar, central bank digital currencies, privacy coins (senders and receivers are anonymous), governance tokens (gives owners the right to vote in decisions regarding blockchain’s future development), utility tokens, and non-fungible tokens (distinct characteristics from all others). This is from a developer/development side. Of course, there are also investors and speculators who are hoping for appreciation. It is very important you know the intent and functionality of cryptocurrency you own or are considering owning.",
    },
    {
      category: "what_is_crypto",
      question: "How are cryptocurrency transactions recorded? ",
      answer:
        "Cryptocurrency transactions are recorded on a shared, digital ledger called a blockchain. This is decentralized technology, spread across many computers, that records every transaction.",
    },
    {
      category: "what_is_crypto",
      question: "Are blockchain and cryptocurrencies the same?",
      answer:
        "No. Blockchain is the technology that allows for cryptocurrencies to work. It is a decentralized and digital ledger of transactions used for cryptocurrencies and other assets/functions. It is important to separate the technology behind cryptocurrencies from the actual cryptocurrencies.",
    },
    {
      category: "what_is_crypto",
      question: "Help me with the lingo — crypto, coins, tokens, ICOs.",
      answer:
        "Here`s a brief glossary:Crypto — umbrella term for all digital and/or virtual currenciesCoins — Generally, any cryptocurrency that has its own separate blockchainTokens — Generally, any cryptocurrency that is built on top of existing blockchain, e.g., some companies issue their own cryptocurrencies, called tokens, which can be used to purchase goods or services specifically from issuing companyICO — Short for Initial Coin Offering, this is analogous to a privately held company going public via an initial public offering (IPO) — a way to raise funds for a new cryptocurrency or expand services for existing coins",
    },
    {
      category: "what_is_crypto",
      question: "What are the top cryptocurrencies?",
      answer:
        "The most popular and widely heard of cryptocurrency is Bitcoin. As of early January 2021, the total cryptocurrency market is over $1 trillion, and Bitcoin is around $700 billion. Believe it or not, there are over 7,800 cryptocurrencies in existence and growing. The top five, with over 80 percent of the market value, are Bitcoin, Ethereum, XRP, Tether, and Litecoin. (footnote 2)",
    },
    {
      category: "what_is_crypto",
      question: "Why are there so many cryptocurrencies? ",
      answer:
        "People saw the success of Bitcoin and tried to improve existing functionality and provide new functionality with new cryptocurrencies. Additionally, investors and developers were certainly trying to make money.",
    },
    {
      category: "what_is_crypto",
      question: "Can cryptocurrencies fail?  ",
      answer:
        "Yes.It is estimated that close to 2,000 cryptocurrencies have failed. This is for a variety of reasons: lack of funding at start and after launch, failure to evolve, and a few were outright frauds. Many of the failures happened during the initial coin offering boom of 2017–2018.",
    },
    {
      category: "what_is_crypto",
      question: "I have U.S. dollars — how do I purchase cryptocurrency? ",
      answer:
        "There are a couple of methods, but the simplest and least expensive is via an online cryptocurrency exchange.You establish an account and from there, you transfer in cash and purchase the cryptocurrency of your choice. The exchange will allow you to buy, sell, and hold cryptocurrency. The user experience, fees, and identification requirements all vary based on the exchange, so it is important to conduct research before you do anything. Some of the most popular are Alfex, Gemini, and Kraken. Additionally, traditional online brokers are starting to offer services such as eToro and Robinhood. Further, fintech and technology companies are starting to offer these services (Square and PayPal as two examples).",
    },
    {
      category: "what_is_crypto",
      question: "What is a crypto wallet?",
      answer:
        "Simply put, crypto wallets are places to store digital assets more securely than just on an exchange. You hold your wallet via an exchange account, custody wallet, or outside of the exchange. You can establish an online or “hot” wallet that is internet connected—to your desktop, table or mobile phone. There is also the option to store on a device that is not connected to the internet (“cold” wallet). Cold wallets are the most secure way to store your cryptocurrency, but they are meant for longer-term holdings as they are not connected to the internet. With cold storage, you must remember your private keys (identifier number for your cryptocurrency).",
    },
    {
      category: "what_is_crypto",
      question: "Are there ways to purchase outside an exchange? ",
      answer:
        "Believe it or not, there are Bitcoin ATMs.You insert cash and bitcoins are transferred to your secure, digital wallet. There are also peer-to-peer (PTP) exchanges. Users post what they are hoping to buy or sell and then choose their trading partner(s).",
    },
    {
      category: "what_is_crypto",
      question:
        "If I want exposure, isn`t there just a security (like an exchange-traded fund) that I could purchase? ",
      answer:
        "These products are just starting to come to the marketplace.The design of these products is to gain exposure to cryptocurrencies like Bitcoin and Ethereum without having to directly purchase. Beyond the fees for doing this, these products currently trade at a very high premium to the underlying cryptocurrency prices. The premium could continue to persist in the future, but investors need to consider the price they are pricing for the exposure.",
    },
    {
      category: "what_is_crypto",
      question: "Why would I purchase a security?",
      answer:
        "Depending on who you ask, you would most likely get a different answer.Some investors believe it will be a store of value over time and a hedge against traditional fiat money. Some people just want to speculate and make a quick buck (coin). Some do want to be part of the ecosystem and use it as an alternative to traditional currency—not as an investment per se but a means of transacting.",
    },
    {
      category: "what_is_crypto",
      question: "Is it true you can trade 24/7?",
      answer:
        "Yes, on many exchanges you can place an order at 11 a.m. Sunday or any other day and time. Many cryptocurrencies trade 24 hours a day, seven days a week.",
    },
    {
      category: "what_is_crypto",
      question: "Can I be hacked?  What if I am hacked?",
      answer:
        "Unfortunately, there is a history of exchanges and online wallets being hacked.This is one of key reasons to thoroughly research where you trade cryptocurrency and securely store your digital assets.  If you are hacked, there is not FDIC insurance or anything similar. If you have a large position, you can purchase individual crypto insurance. Additionally, many exchanges finance their own insurance plans in the event of a hack. The insurance coverage is generally capped and not guaranteed, so there is still a risk of loss.",
    },
    {
      category: "what_is_crypto",
      question: "Is institutional adoption increasing? ",
      answer:
        "There was an increased institutional adoption in 2020 from traditional banks, newer technology companies, endowments, and pensions.As examples, Square and PayPal are now allowing users to buy, hold, and sell cryptocurrencies via their apps and use them for payments in certain instances.  Asset custodians are also working on products and services, such as Fidelity with its Digital Assets Group.",
    },
    {
      category: "what_is_crypto",
      question: "What are other considerations/will prices keep going up?",
      answer:
        "This is a rapidly evolving space on all fronts: development, investment, regulatory, and trading. All the areas surrounding cryptocurrency—trading, execution, custody—will continue to become more efficient, less expensive, and safer as the market matures and more institutional players get involved.Governments are considering additional rules, regulations, and disclosures for consistent identity collection, reducing illegal activity, and tax collection. There is still not consensus about the best use case and even what that is (viable alternative currency, store of value, investment, speculative, etc.) and that is okay. Ultimately, the stakeholders and marketplace will determine the next decade of cryptocurrency.",
    },
  ],
});

export const getters = {
  getAllFaq(state) {
    return state.faq_items;
  },
};

export const actions = {};

export const mutations = {};
