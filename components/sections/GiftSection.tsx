"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Gift, QrCode, Download } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { copyToClipboard } from "@/lib/utils";
import { cn } from "@/lib/utils";

// --- KOMPONEN ACCOUNT CARD (TRANSFER BANK) ---
interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
}

function AccountCard({ gift }: { gift: BankAccount }) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy(text: string) {
    try {
      await copyToClipboard(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="card-glass rounded-3xl border border-[#D4AF37]/15 overflow-hidden shadow-[0_4px_32px_rgba(212,175,55,0.08)]">
      <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent p-6 pb-4 border-b border-[#D4AF37]/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/15">
            <Gift className="h-5 w-5 text-[#D4AF37]" aria-hidden />
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-[color:var(--text-muted)]">
              Transfer ke
            </p>
            <p className="font-serif text-base font-semibold text-[color:var(--text-primary)]">
              Bank {gift.bankName}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="font-sans text-xs text-[color:var(--text-muted)]">
            Atas Nama
          </p>
          <p className="font-serif text-lg font-semibold text-[color:var(--text-primary)]">
            {gift.accountHolder}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-sans text-xs text-[color:var(--text-muted)]">
            Nomor Rekening
          </p>
          <div className="flex items-center gap-3">
            <p className="font-mono text-xl font-bold tracking-widest text-[#D4AF37]">
              {gift.accountNumber}
            </p>
            <motion.button
              onClick={() => handleCopy(gift.accountNumber)}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
                isCopied
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/60"
              )}
              whileTap={{ scale: 0.9 }}
              aria-label={isCopied ? "Tersalin" : "Salin"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isCopied ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          <AnimatePresence>
            {isCopied && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-emerald-400">
                Nomor rekening tersalin
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN QRIS CARD ---
interface QrisData {
  imageSrc: string;
  accountHolder: string;
}

function QrisCard({ qris }: { qris: QrisData }) {
  // Membuat nama file download yang dinamis sesuai nama pemilik
  const downloadFileName = `QRIS-${qris.accountHolder.replace(/\s+/g, "-")}.png`;

  return (
    <div className="card-glass flex flex-col items-center rounded-3xl border border-[#D4AF37]/15 p-8 shadow-[0_4px_32px_rgba(212,175,55,0.08)]">
      <div className="mb-4 flex items-center gap-2">
        <QrCode className="h-5 w-5 text-[#D4AF37]" />
        <h3 className="font-serif text-lg font-semibold text-[color:var(--text-primary)]">
          Scan QRIS
        </h3>
      </div>

      <div className="mb-4 overflow-hidden rounded-2xl bg-white p-4 shadow-inner">
        <img
          src={qris.imageSrc}
          alt={`QRIS Barcode ${qris.accountHolder}`}
          className="h-48 w-48 object-contain sm:h-56 sm:w-56"
          loading="lazy"
        />
      </div>

      <p className="mb-6 font-sans text-sm font-medium text-[color:var(--text-primary)]">
        a.n. {qris.accountHolder}
      </p>

      <a
        href={qris.imageSrc}
        download={downloadFileName}
        className="group flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-6 py-2.5 font-sans text-sm font-medium text-[#D4AF37] transition-all hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/20"
      >
        <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        Simpan QRIS
      </a>
    </div>
  );
}

// --- KOMPONEN UTAMA GIFT SECTION ---
export function GiftSection() {
  // Data 2 QRIS
  const qrisDataList: QrisData[] = [
    {
      imageSrc: "/images/qris1.jpeg", // Path QRIS pertama (misal: pengantin pria)
      accountHolder: "Habib Shibghatallah",
    },
    {
      imageSrc: "/images/qris1.jpeg", // Path QRIS kedua (misal: pengantin wanita)
      accountHolder: "Linda Nur'ain",
    }
  ];

  // Data 2 Rekening Bank
  const giftsData: BankAccount[] = [
    {
      bankName: "BNI",
      accountHolder: "Habib Shibghatallah",
      accountNumber: "2049463152",
    },
    {
     bankName: "BSI",
      accountHolder: "Linda Nur'ain",
      accountNumber: "asdfasd",
    }
  ];

  return (
    <section
      id="gift"
      className="py-24 section-padding overflow-hidden"
      aria-label="Informasi hadiah dan rekening"
    >
      <div className="mx-auto max-w-md">
        <Reveal direction="up">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
              Wedding Gift
            </span>
            <h2 className="font-serif text-3xl font-bold gold-text sm:text-4xl">
              Hadiah
            </h2>
            <div className="gold-divider w-24" aria-hidden />
            <p className="font-sans text-sm text-[color:var(--text-secondary)] max-w-sm text-balance leading-relaxed">
              Kehadiran dan doa Anda adalah hadiah terindah bagi kami. Namun
              jika Anda ingin memberikan tanda kasih, kami menerima dengan penuh
              rasa syukur melalui pilihan di bawah ini.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          {/* 1. Render 2 QRIS Cards */}
          {qrisDataList.map((qris, index) => (
            <Reveal key={`qris-${index}`} delay={0.15 + index * 0.1} direction="up">
              <QrisCard qris={qris} />
            </Reveal>
          ))}

          {/* 2. Pemisah Visual ("Atau Transfer Bank") */}
          <Reveal delay={0.35} direction="up">
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
              <span className="font-sans text-xs text-[#D4AF37]/60 uppercase tracking-widest text-center">Atau Transfer</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
            </div>
          </Reveal>

          {/* 3. Render 2 Account Cards */}
          {giftsData.map((gift, index) => (
            <Reveal key={`bank-${index}`} delay={0.45 + index * 0.1} direction="up">
              <AccountCard gift={gift} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.65} direction="up">
          <p className="mt-8 text-center font-sans text-xs text-[color:var(--text-muted)] leading-relaxed">
            Konfirmasi transfer dapat dikirimkan melalui WhatsApp kepada
            keluarga pengantin. Terima kasih atas kebaikan hati Anda.
          </p>
        </Reveal>
      </div>
    </section>
  );
}