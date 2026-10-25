import { useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, Share2, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url?: string;
  title: string;
}

const WhatsAppIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Zm0 0a5 5 0 0 0 5 5m0 0h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1Z" />
  </svg>
);

export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  // Resolve current browser URL reliably
  const currentUrl =
    url && url.trim().length > 0
      ? url
      : typeof window !== "undefined"
      ? window.location.href
      : "https://theglobaldoctrine.online";

  // Facebook & LinkedIn sharers reject localhost URLs; map localhost paths to production domain for external sharers
  const publicShareUrl = (() => {
    try {
      const parsed = new URL(currentUrl);
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        return `https://theglobaldoctrine.online${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
      return parsed.toString();
    } catch {
      return currentUrl;
    }
  })();

  const encodedUrl = encodeURIComponent(publicShareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedWhatsAppText = encodeURIComponent(`${title}\n${publicShareUrl}`);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedWhatsAppText}`;
  const twitterShareUrl = `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handlePopupShare = (
    e: React.MouseEvent<HTMLAnchorElement>,
    shareHref: string
  ) => {
    // On desktop screens, open a clean centered share popup window
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      e.preventDefault();
      const width = 620;
      const height = 540;
      const left = Math.max(0, (window.screen.width - width) / 2);
      const top = Math.max(0, (window.screen.height - height) / 2);
      window.open(
        shareHref,
        "_blank",
        `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`
      );
    }
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Unable to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: title,
          url: currentUrl,
        });
        return;
      } catch (err) {
        // Ignore user-cancelled share sheet
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    await copyToClipboard();
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      <span className="mr-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        Share
      </span>

      {/* Facebook */}
      <a
        href={facebookShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => handlePopupShare(e, facebookShareUrl)}
        title="Share on Facebook"
        aria-label="Share on Facebook"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
      >
        <Facebook className="h-3.5 w-3.5" />
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => handlePopupShare(e, whatsappShareUrl)}
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-[#25D366] hover:text-white hover:border-[#25D366]"
      >
        <WhatsAppIcon className="h-3.5 w-3.5" />
      </a>

      {/* X (Twitter) */}
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => handlePopupShare(e, twitterShareUrl)}
        title="Share on X (Twitter)"
        aria-label="Share on X (Twitter)"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-black hover:text-white hover:border-black"
      >
        <Twitter className="h-3.5 w-3.5" />
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => handlePopupShare(e, linkedinShareUrl)}
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]"
      >
        <Linkedin className="h-3.5 w-3.5" />
      </a>

      {/* Copy Link */}
      <button
        type="button"
        onClick={copyToClipboard}
        title={copied ? "Copied!" : "Copy article link"}
        aria-label="Copy article link"
        className={`flex h-8 items-center justify-center gap-1 border px-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
          copied
            ? "border-primary bg-primary text-white"
            : "border-border bg-background text-foreground hover:border-primary hover:bg-primary hover:text-white"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            <span className="hidden xs:inline sm:inline">Copy</span>
          </>
        )}
      </button>

      {/* Native Share Sheet (Mobile / OS Share) */}
      <button
        type="button"
        onClick={handleNativeShare}
        title="More share options"
        aria-label="More share options"
        className="flex h-8 w-8 items-center justify-center border border-border bg-background text-foreground transition-all hover:border-[hsl(var(--brand-red))] hover:bg-[hsl(var(--brand-red))] hover:text-white"
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
