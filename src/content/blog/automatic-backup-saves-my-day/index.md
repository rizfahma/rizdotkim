---
title: "Automatic Backup Saves My Day"
date: "2021-09-06"
summary: "The $2 backup service that saved my VPS: why automatic backups are worth every penny"
categories: 
  - "story"
tags: 
  - "backup"
  - "linode"
  - "vps"
---

## I learned the hard way that cost my blog(s) down for tens of minutes in the last 6 months or so.

**Whoops... Probably more than that.**

Managing my own self hosted blogs are definitely not always been a perfect decision, since I have to do all the jobs by myself. From ordering domains, VPS, finding the best web hosting Control Panel for me, setting up the blogs, writing contents, and so on and so forth are always be challenging.

Regardless of all the challenges, I found that by doing so I managed to learn a lot that eventually turns to be a valuable set of skills. Some people who don't have time, willingness to learn, and to do trial and errors choose to pay people to do those jobs, that in some case could cost thousands of dollars.

In the process of doing these things, in which one of the reasons why I decide to do so, is to save some money. $2 or even $1 of difference in VPS cost is a lot in a long term, since my blogs are run on paid VPS since years ago.

> VPS = Virtual Private Server

If you ask me why I choose VPS rather than using some cheap web host options out there, well, on VPS my blogs run on its own virtual server. Compared to those cheap web hosts out there that are sharing resources with hundreds or maybe even thousands other blogs.

If you ask me why I don't upgrade it to a better one, like a dedicated server... Well, that's more expensive and currently my blogs traffic isn't that much that needs more computing resources.

I have been there. On those shared web host my blogs were often down for many times in a single month.

Now that I am using VPS which gives me more independency to manage my own blogs without needing to worry too much if other random users are using too much resources that I share with.

### You said that you're using VPS, but still your blogs down as well, right?

That's 100% true. Using VPS doesn't mean that my blogs would be 100% free from any downtime. What it does for me is to help me mitigating the risks from using shared host that often costs my blogs down regularly.

As a comparison, let's say if I use a shared web host, my blog would have been down for at least 1 hour every 1 week (~99.405% uptime), which means in a year, my blogs would have been down for about 2 days 4 hours 7 minutes 19 seconds. And that's even when I am only assuming if my blogs were down only 1 hour a week which often more than that in a real scenario.

Compare it if I use a VPS, that in my experience in a month it would probably down for about an hour, that is quite rarely happened. 1 hour down in a month (99.8611% uptime), which means in a year my blogs would only have been down for about 12 hours 10 minutes 4 seconds.

If you see the comparison above you can understand that VPS matters. Large websites like Google, Facebook, Apple, Amazon won't even let their servers have less than 99.999% uptime. 0.0001% of downtime in a year could cost them Billions of $$$. They don't use VPS, they use tech stacks that are much much much more powerful than just a VPS. They own their own servers, real ones, not Virtual like I do.

#### Enough for that story, let's get to the point already

As I mentioned earlier on this post, that I learned the hard way. What I mean by that was that I learned that mitigating the risk for my blogs are super necessary.

Including for something that costs some $.

I had not used any backup mechanism for my blogs for quite a long time. Honestly.

I relied too much on my VPS and the web host control panel that I installed on my own, without worrying that a certain accident could make me pay for it.

I once did some silly things on some of my blogs, that at that time I hadn't create any backup, and I had to fix the issues for many hours.

I saw an offer on my VPS provider website that they would do regular automatic backups for additional $2 a month.

#### I ignored that. What a stupid idea it was.

I learned the hard way, and I did revenge on that. I finally put that backup service on my cart and activated it on regular. Yeah it would cost me additional $$, but I thought let's see what this money will worth.

And just this morning, I opened my email and saw a notification that my blogs have been down. First I just ignored it, because often times it would just came back normal after a few minutes.

Then I open my email again, and I saw more and more offline notification came in.

My blog was down for 1 hour already.

And I was starting to panic

- I rebooted my VPS. Once, twice, no change.
- I tried to reboot my web control panel via my Macbook Terminal. Still, no luck
- I tried the other method that I thought might have worked.
- I opened my Cloudflare account to change some setups, and check my blog if it was online or not. And still, no change. Dammit.

I rebooted my VPS and tweak my web host control panel back and forth. And still nothing was working.

### Blogs were down for 3 hours already!

And, I finally do a thing that I thought would also waste my time. Which is to restore my VPS using the backup file from the automatic backups.

It took about 16 minutes and 18 seconds to do so. I was doing my main job, so I didn't really notice it.

Then I open a new tab again, didn't hope anything, and thank God, I saw it online. Not one, but all other blogs that I host on a same VPS are back online.

What an additional $2 a month difference can make!

That price of less than a cup of Starbucks coffee saved my ASS. I am sorry, it saved my day!

I didn't think that automatic backup on my VPS could be that useful. I thought that yeah, it would prolly be useful, but I couldn't prolly do it. But not at all. Restoring a backup on the VPS is super easy. All I need to do was just picking which backup file I would like to restore, wait for a few minutes, and vo i la... The blogs were back again.

_That's it. What a day._

By the way, I am using Linode as my VPS. Been using it for years already :-)

* * *

```
Disclaimer: The Linode link is an affiliated one. Please use that link to get $100 credit to use on Linode, 60-day credit once a valid payment method is added to your new account.
```
