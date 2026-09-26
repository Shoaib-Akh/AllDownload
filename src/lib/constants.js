export const SITE_NAME = 'SaveFromPro';
export const SITE_DESCRIPTION = 'Free online video downloader. Download videos from Facebook, Instagram, TikTok, Twitter/X, and 8 more platforms in HD quality.';
export const SITE_URL = 'https://savefrompro.com';

export const PLATFORMS = [
  {
    slug: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    gradient: 'from-[#1877F2] to-[#0a5dc2]',
    baseUrl: 'https://facebook.com',
    description: 'Download Facebook videos, reels, and stories in HD quality. Fast, free, and no login required.',
    features: ['Videos', 'Reels', 'Stories', 'HD Quality'],
    urlPattern: /(?:https?:\/\/)?(?:www\.|m\.|web\.)?(?:facebook\.com|fb\.watch|fb\.com)/i,
  },
  {
    slug: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    color: '#E4405F',
    gradient: 'from-[#E4405F] via-[#FD1D1D] to-[#F77737]',
    baseUrl: 'https://instagram.com',
    description: 'Download Instagram reels, posts, stories, and IGTV videos. Save any Instagram content easily.',
    features: ['Reels', 'Posts', 'Stories', 'IGTV'],
    urlPattern: /(?:https?:\/\/)?(?:www\.)?instagram\.com/i,
  },
  {
    slug: 'tiktok',
    name: 'TikTok',
    icon: 'music',
    color: '#000000',
    gradient: 'from-[#00f2ea] to-[#ff0050]',
    baseUrl: 'https://tiktok.com',
    description: 'Download TikTok videos without watermark in HD. Save TikTok content for offline viewing.',
    features: ['No Watermark', 'HD Videos', 'MP3 Audio', 'Fast'],
    urlPattern: /(?:https?:\/\/)?(?:www\.|vm\.)?tiktok\.com/i,
  },
  {
    slug: 'twitter',
    name: 'Twitter / X',
    icon: 'twitter',
    color: '#000000',
    gradient: 'from-[#1DA1F2] to-[#0d8bd9]',
    baseUrl: 'https://x.com',
    description: 'Download Twitter/X videos and GIFs from tweets. Save any media from X posts instantly.',
    features: ['Videos', 'GIFs', 'HD Quality', 'Fast'],
    urlPattern: /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)/i,
  },
  {
    slug: 'snapchat',
    name: 'Snapchat',
    icon: 'ghost',
    color: '#FFFC00',
    gradient: 'from-[#FFFC00] to-[#e6e300]',
    baseUrl: 'https://snapchat.com',
    description: 'Download Snapchat Spotlight videos and public stories. Save snaps before they disappear.',
    features: ['Spotlight', 'Stories', 'HD Videos', 'Fast'],
    urlPattern: /(?:https?:\/\/)?(?:www\.|story\.)?snapchat\.com/i,
  },
  {
    slug: 'twitch',
    name: 'Twitch',
    icon: 'twitch',
    color: '#9146FF',
    gradient: 'from-[#9146FF] to-[#772ce8]',
    baseUrl: 'https://twitch.tv',
    description: 'Download Twitch clips and VODs. Save your favorite streaming moments offline.',
    features: ['Clips', 'VODs', 'HD Quality', 'Fast'],
    urlPattern: /(?:https?:\/\/)?(?:www\.|clips\.)?twitch\.tv/i,
  },
  {
    slug: 'dailymotion',
    name: 'Dailymotion',
    icon: 'play',
    color: '#00AAFF',
    gradient: 'from-[#00AAFF] to-[#0088cc]',
    baseUrl: 'https://dailymotion.com',
    description: 'Download Dailymotion videos in multiple qualities. Fast and free video downloader.',
    features: ['Videos', 'Multiple Quality', 'Fast', 'Free'],
    urlPattern: /(?:https?:\/\/)?(?:www\.)?(?:dailymotion\.com|dai\.ly)/i,
  },
  {
    slug: 'vimeo',
    name: 'Vimeo',
    icon: 'video',
    color: '#1AB7EA',
    gradient: 'from-[#1AB7EA] to-[#162221]',
    baseUrl: 'https://vimeo.com',
    description: 'Download Vimeo videos in HD, Full HD, and 4K quality. Professional video downloads.',
    features: ['HD', 'Full HD', '4K', 'Fast'],
    urlPattern: /(?:https?:\/\/)?(?:www\.)?vimeo\.com/i,
  },
  {
    slug: 'reddit',
    name: 'Reddit',
    icon: 'message-circle',
    color: '#FF4500',
    gradient: 'from-[#FF4500] to-[#cc3700]',
    baseUrl: 'https://reddit.com',
    description: 'Download Reddit videos with audio merged. Save any Reddit video or GIF post.',
    features: ['Videos', 'GIFs', 'Audio Merged', 'HD'],
    urlPattern: /(?:https?:\/\/)?(?:www\.|old\.)?(?:reddit\.com|redd\.it)/i,
  },
  {
    slug: 'threads',
    name: 'Threads',
    icon: 'at-sign',
    color: '#000000',
    gradient: 'from-[#000000] to-[#333333]',
    baseUrl: 'https://threads.net',
    description: 'Download Threads videos and images. Save content from Meta Threads app.',
    features: ['Videos', 'Images', 'Fast', 'Free'],
    urlPattern: /(?:https?:\/\/)?(?:www\.)?threads\.net/i,
  },
  {
    slug: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0A66C2',
    gradient: 'from-[#0A66C2] to-[#004182]',
    baseUrl: 'https://linkedin.com',
    description: 'Download LinkedIn videos from posts. Save professional content for offline viewing.',
    features: ['Videos', 'HD Quality', 'Fast', 'Free'],
    urlPattern: /(?:https?:\/\/)?(?:www\.)?linkedin\.com/i,
  },
  {
    slug: 'pinterest',
    name: 'Pinterest',
    icon: 'pin',
    color: '#E60023',
    gradient: 'from-[#E60023] to-[#ad001a]',
    baseUrl: 'https://pinterest.com',
    description: 'Download Pinterest images and video pins in high resolution. Save pins easily.',
    features: ['Images', 'Video Pins', 'High Res', 'Fast'],
    urlPattern: /(?:https?:\/\/)?(?:www\.)?(?:pinterest\.[a-z.]+|pin\.it)/i,
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Copy the Snap Link',
    description: 'Open the post, tap the share icon and select “Copy Link.” On desktop, just copy the URL from the address bar.',
    bar: 'Works for public posts only',
    icon: 'clipboard-paste',
  },
  {
    step: 2,
    title: 'Paste Into Savefrompro',
    description: 'Come back here and paste the link into the field above. Tap Paste or hit Ctrl+V on desktop. The link fills in instantly — no typing needed.',
    bar: 'No account or login required',
    icon: 'search',
  },
  {
    step: 3,
    title: 'Choose Quality & Save',
    description: 'Pick HD or SD, hit Download. Your file saves straight to your camera roll or Downloads folder — no watermark, no fuss.',
    bar: 'Also save as MP3 audio',
    icon: 'download',
  },
];

export const FEATURES = [
  {
    title: 'Completely Free',
    description: 'No hidden charges, no premium plans. Download unlimited videos for free.',
    icon: 'badge-dollar-sign',
  },
  {
    title: 'HD Quality',
    description: 'Download videos in the highest quality available — HD, Full HD, and even 4K.',
    icon: 'monitor',
  },
  {
    title: 'No Registration',
    description: 'No signup, no login, no personal data required. Just paste and download.',
    icon: 'user-x',
  },
  {
    title: 'Lightning Fast',
    description: 'Powered by Cloudflare Edge network for the fastest downloads worldwide.',
    icon: 'zap',
  },
  {
    title: '12+ Platforms',
    description: 'Support for Facebook, Instagram, TikTok, Twitter/X, and 8 more platforms.',
    icon: 'layout-grid',
  },
  {
    title: 'Mobile Friendly',
    description: 'Works perfectly on any device — phone, tablet, or desktop. No app needed.',
    icon: 'smartphone',
  },
];

export const GLOBAL_FAQS = [
  {
    question: 'Is SaveFromPro free to use?',
    answer:
      "Yes. Pasting a link and saving a file doesn't require payment or a subscription on any of the twelve supported platforms.",
  },
  {
    question: 'Do I need to install an app?',
    answer:
      "No. SaveFromPro runs entirely in your browser, on both mobile and desktop, so there's nothing to install and nothing to update.",
  },
  {
    question: 'Can I download from a private account?',
    answer:
      "No. If a post isn't visible to the public, SaveFromPro can't fetch it. This is intentional — it keeps the tool aligned with what people have already chosen to share publicly.",
  },
  {
    question: 'Will the download have a watermark on it?',
    answer:
      "SaveFromPro doesn't add its own watermark. Whether the original file already includes one depends on the platform and the creator's settings.",
  },
  {
    question: 'Which file format do I get?',
    answer:
      'Video typically saves as MP4 and photos as JPG or PNG — standard formats that play on virtually any phone, tablet or computer.',
  },
  {
    question: 'Is it safe to paste a link from any of these platforms?',
    answer:
      "SaveFromPro only reads the public link you paste to locate the media file; it doesn't ask for your username, password, or platform login at any point.",
  },
  {
    question: 'Why do I need a separate page for each platform?',
    answer:
      "Each platform structures its share links and media files differently, so a page tuned to one platform's link format gives more reliable results than a single one-size-fits-all box.",
  },
  {
    question: 'Can I use SaveFromPro on my phone?',
    answer:
      "Yes — open the site in your phone's browser, paste the link from the share sheet, and save the file to your camera roll or downloads folder.",
  },
  {
    question: 'Does SaveFromPro work the same way on every platform?',
    answer:
      "The paste-and-fetch idea is the same everywhere, but each platform's dedicated page is tuned to that platform's link format and content types, which gives more reliable results than one generic box.",
  },
  {
    question: 'What happens to a link after I paste it?',
    answer:
      "It's used only to locate and prepare the file for you to save — SaveFromPro doesn't keep a history of links or files once your download is complete.",
  },
  {
    question: "What if a platform I use isn't listed here?",
    answer:
      "The twelve platforms above cover the majority of everyday video and photo sharing. If a link from one of them doesn't resolve, double-check that the specific post is public before assuming the tool doesn't support it.",
  },
];
