# 🔗 News Aggregator - Blockchain Layer

Ovaj modul zadužen je za osiguravanje integriteta vijesti pomoću Ethereum (lokalnog) blockchaina. Svaki događaj (Event) koji se generira u sustavu dobiva svoj jedinstveni SHA-256 hash koji se trajno zapisuje u pametni ugovor (Smart Contract).

## 🛠️ Preduvjeti

1. Instaliran i pokrenut **Ganache** (UI ili CLI verzija).
2. Podešen port u `.env` datoteci (najčešće `http://127.0.0.1:8545`).
3. Python okruženje sa svim instaliranim paketima (`web3`, `py-solc-x`).

## 🚀 Pokretanje i Deploy

Da bi blockchain validacija radila, potrebno je prvo "postaviti" pametni ugovor na mrežu:

1. **Pokreni Ganache** (ako već nije pokrenut).
2. Otvori terminal u mapi `blockchain`.
3. Pokreni skriptu za deploy:
   ```bash
   python deploy.py