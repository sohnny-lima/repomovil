function detectItemType(url = "") {
  const u = String(url).toLowerCase();

  // YouTube
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "YOUTUBE";

  // Google Drive
  if (u.includes("drive.google.com")) return "DRIVE";

  // OneDrive (share links comunes)
  if (
    u.includes("onedrive.live.com") ||
    u.includes("1drv.ms") ||
    u.includes("sharepoint.com")
  )
    return "ONEDRIVE";

  return "OTHER";
}

module.exports = { detectItemType };
