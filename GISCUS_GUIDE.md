# Giscus Comments Management Guide

## Overview
Your blog now uses Giscus for comments, powered by GitHub Discussions. This provides excellent security, spam protection, and zero maintenance.

## How It Works
- Comments are stored as GitHub Discussions in your repository: `rizfahma/rizdotkim`
- Users must have a GitHub account to comment
- You (as the repo owner) have full moderation control
- Automatic spam filtering via GitHub's systems
- If Giscus fails to load, a fallback GitHub Discussions link is shown

## Setup Instructions (Important!)

To enable Giscus comments, you need to:

1. **Enable Discussions in your GitHub repository:**
   - Go to https://github.com/rizfahma/rizdotkim/settings
   - Scroll down to "Features" section
   - Check "Discussions" and save

2. **Create a discussion category:**
   - Go to https://github.com/rizfahma/rizdotkim/discussions
   - Click "New discussion"
   - Choose a category (e.g., "General" or create "Blog Comments")

3. **Test the comments:**
   - Visit any blog post on your site
   - The comment section should appear
   - If not, the fallback GitHub Discussions link will be shown

## Moderation & Security Features

### Built-in Security
✅ **GitHub Authentication** - Only verified GitHub users can comment  
✅ **Automatic Spam Filtering** - GitHub's AI-powered spam detection  
✅ **Rate Limiting** - IP-based rate limiting prevents spam floods  
✅ **Content Moderation** - Full GitHub moderation tools available  

### Comment Management
As the repository owner, you can:
- **Delete comments** directly in the GitHub Discussion
- **Hide/report** inappropriate content
- **Lock discussions** to prevent new comments
- **Block users** from commenting
- **Convert discussions to issues** for better tracking

## Moderation Workflow

### 1. Access Your Discussions
Go to: https://github.com/rizfahma/rizdotkim/discussions/categories/blog-post-comment

### 2. Monitor Comments
- New comments appear automatically in the "Blog Post Comment" category
- Each blog post gets its own discussion thread
- Comments are mapped by URL for automatic organization

### 3. Handle Spam
**For obvious spam:**
1. Go to the Discussion
2. Click "..." on the spam comment
3. Select "Delete comment"
4. Consider blocking the user if necessary

**For borderline content:**
1. Hide the comment temporarily
2. Review context and user history
3. Decide whether to restore or delete

### 4. Advanced Moderation
**To convert a discussion to an issue (better for complex moderation):**
1. Open the problematic discussion
2. Click "Tools" → "Convert to issue"
3. This gives you GitHub's full issue tracking tools

## Configuration Details

### Current Settings
- **Repository:** rizfahma/rizdotkim
- **Category:** Blog Post Comment
- **Mapping:** URL (each blog post maps to a unique discussion)
- **Strict Mode:** Enabled (only exact URL matches)
- **Reactions:** Enabled (emoji reactions)
- **Theme:** Light mode default, automatically switches with site theme
- **Input Position:** Top (comment box at the top)
- **Language:** English

### Theme Features
✅ **Light mode default** - Comments load in light theme by default  
✅ **Automatic theme switching** - Follows site's dark/light toggle  
✅ **Smooth transitions** - Updates when theme button is clicked  
✅ **Synchronization** - Stays in sync with header and drawer theme buttons

### Customization Options
You can modify these in `src/components/PostComments.astro`:
- `data-theme`: Change to "light", "dark", or custom themes
- `data-lang`: Change language support
- `data-reactions-enabled`: Set to "0" to disable reactions
- `data-input-position`: Change to "bottom" if preferred

## Best Practices

### For Readers
- Encourage meaningful discussions
- Use markdown for formatting
- Tag specific users with @username
- React to helpful comments with emojis

### For Site Owner
- Monitor discussions periodically
- Respond to legitimate comments
- Update discussion category organization as needed
- Consider creating additional categories for different content types

## Privacy & Compliance
✅ **GDPR Compliant** - No tracking or data selling  
✅ **No Third-party Cookies** - Only GitHub authentication  
✅ **Data Portability** - Users can export their GitHub data  
✅ **Right to Deletion** - Users can delete their own comments  

## Troubleshooting

### Comments Not Loading
1. Check if JavaScript is enabled
2. Verify GitHub repository is public
3. Check browser console for errors

### Spam Issues
1. Enable stricter moderation in repository settings
2. Use GitHub's blocked users feature
3. Report spam to GitHub for system-wide filtering

### Performance Issues
- Comments load lazily (won't slow down page load)
- Uses CDN for fast delivery
- Minimal impact on site performance

## Alternative Options
If you need non-GitHub authentication in the future:
- Consider Hyvor Talk ($8/month)
- Disqus (has privacy concerns)
- Self-hosted solutions (require maintenance)

## Support
- Giscus Documentation: https://giscus.app/
- GitHub Discussions Documentation: https://docs.github.com/en/discussions
- For issues specific to your setup, check the browser console and GitHub repository settings