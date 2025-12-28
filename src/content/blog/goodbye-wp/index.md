---
title: "Goodbye WP"
date: "2025-12-25"
categories: 
  - "Blog"
tags: 
  - "Experience"
summary: "After multiple years, I think it is the right time to unplug it and move on"
---
### A Farewell After 17 Years?

So I just moved everything out of WP a few months ago.
It wasn't a sudden move; I had been thinking about it for a few years.

I decided to stop using WordPress as my blogging platform, including this blog that you are reading.

I managed my WordPress installations myself. I didn't use a managed cloud service. I ran it on a Linux-based VPS (Virtual Private Server) that I installed and configured myself, and I tried AWS too and switched to several cloud providers. However, it became overwhelming to handle.

#### The Reasons

**Tired of Downtime**

Most of the time my blogs ran well, until I got emails notifying me of 8-minute outages. While less than 5 times a month wasn't terrible, it started bothering me when it happened 5 times a day. Sometimes I knew the cause; sometimes I had no idea why.

**Feeling Drained for Such a Simple Purpose**

When you use WordPress, there's always the temptation to use plugins to improve your blog's performance—speed, security, search engine visibility, user engagement, UI/UX, and more. Each plugin has its own configurations, settings, and assets that affect your backend.

Put more than tens of plugins under the hood without scaling up your stacks (which also meaning more cost), and see how those things slow down your blog. Let alone when more and more people visit your blog at the same time, and voila! your inbox will have warm greetings saying that your usage is spiking or probably downtime happens.

I knew this could happen, so I only used several plugins that:
1. Enhance speed
2. Enhance security
3. Look pleasing (simple, yet not boring)

Yet, somehow no matter how much I customize it as simple as I could, it still went down sometimes.

In order to prevent downtimes which could be caused by security issues, I had to update both the Linux OS and related libraries, as well as the WP plugins across several blogs I maintained. 

Sometimes I could easily find time for that, but sometimes I couldn't do so.

Each update should be good for the blogs, but sometimes unpredictable things could happen too. 

I could not know all the details happen on every updates.


<u>**Spam Comments**</u>

Well, that's hella issue when you manage your own WP installations. You could potentially attract 1000s of spam comments on your blogs on a monthly basis. Yes it was not a problem if you use something like Akismet - Jetpack spam filter, or any paid plugins to prevent or to auto delete those shit. My blog wasn't eligible no more for several free services from Jetpack including that spam filter.

And I grew tired of manually deleting those spam comments flooded my blogs every week. 

Those spammers work with their own bots that deploys to inject spam comments on any target to put their links promotoing their products/ services. If you leave your WordPress blogs unguarded, most likely you would have tons of spam comments too.

<u>**Cost efficiency**</u>

As I mentioned earlier, I hosted my WordPress installations on VPS (mostly). It was not free at all, unless when I did free trials, or when I had "vouchers" of $$$ to spend on the cloud provider services. 

But how much was too much of backing up, migrating, re-spinning your Operating System, WordPress installations you should've taken for just chasing some free server allowances? I bet it would be better to not moving too much. As it could actually ruin your blog ranking on Search Engine. Thus, paying for the services was a must.

Last time I paid for my VPS on some European provider was like €8/month. Not that expenisve huh? Multiply it by 12 and now we see the difference.

I didn't mind to spend some money on VPS, as I had freedom to run my blogs on any kind of tech stacks I wanted(despite it was just for running WordPress installations) and didn't need to be bothered by others (like when you use other cheaper services).

However, cost - benefit wise I believe I could make it more efficient. In fact, my blog only has like hundreds to few thousands of visits each month.

### Enter Static Blogs
I had been exploring the alternatives of running blogs outside of WordPress ecosystem, and boy oh boy, there are so many out there. You could use Joomla (also available on free version if you don't want to use the enterprise version), blogger (the first blogging platform I used like centuries ago, and I believe you are familiar with it too), Ghost, Medium, or any other CMS (Content Management System) - list goes on and on, or you could just run yours in a static ways.

A few years ago this approach started to gain more popularity. You could just host your blogs in markdown format, push it to github, use Hugo - Jekyll, do some configs, and add your own domain, and it's live. 

I am now using slightly similar approach, but using different flows and provider to publish my blogs.

Yes I have been using this static blog approach for several months already, and I really appreciate it that it is almost never been down so far.

Now I don't have to worry too much about configuring plugins and stuff, as it runs on HTML, CSS, Javascript (and a few libraries) static wise. Those things are rendered by the platform I use. And you know what's the best part? It's all free, excluding the annual domain fee for sure.

Despite the cost efficiency, there is a major risk lie here actually, that could actually ruin the day. That if you mistakenly do some incorrect syntaxes, or updating the libraries, your deployment could cause errors and your blog doesn't run at all. 

You just see all those weird logs on the browser. And you know what to do? Debugging. 

Sometimes it is easily to figure out, sometimes it causes headaches.

If you lost your passion doing that, you could just undo the deployment and return to the previous version. 

_**Problem solved, curiosity grows though. Haha.**_

### Things I Sacrificed by Leaving WordPress
Despite all the simplicity and efficiency from moving away, I still miss some of the beauty of using WP.

**Image or any asset management simplicity.**

When using WP, we just do drag and drop the images, or assets the way we wanted like when you do it on Microsoft **freaking Word. The CMS (WP) will do the heavy-lifting for you. If you have those plugins (mostly are free), they can optimize the images for you in the background. You just need to add some alt-text if you want the search engines "read" those images easily, that makes it search engine friendly.

I know I can also add images on my current static blog too. But I have to put it somewhere, copy the URL, put the link within some code snippets. But when I put many images, it's going to be hell of things to manage.

**Comments from Real People**

By leaving my WordPress installations, the comments from my blog visitors from all the 17 years period are gone. 

I knew we probably could do something to keep them in the current setups, but I just didn't have the time to do so.

There's some technical issues I had to face, also it would add more complexities. So I decided to abandon the Comment section for this blog. 

Yes I could incorporate some third party services here. But again, for now it seems not that feasible to do.


**Plugins**

Yes, plugins! I know plugins could be bloated. You do not really know what are actually happening in the background, how they are really working and to where they have connection to. But there are plugins that very useful too, like the ones for Analytics, SEO (Search Engine Optimization), Image , HTML, CSS, JS compressors, Backup and Restore.

On my current static blog, we don't have that kind of things.

But you know, there's always be that trade-offs. I just want to run my blogs as simple as best without needing to tweak here and there, not much of downtimes, and lastly, not spending too much.

### Overall it has been quite a smooth transition, ain't it?

I guess so.

I am getting busier and busier at work in the last few months. Much more busier than before. Glad that I made that move to this static blog solution.

Now I have more time stressing and frustrating on other things.

> Here’s to simpler stacks, clearer minds, and writing that lasts longer than a server uptime.”

Cheers. 

Good night!