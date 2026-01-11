---
title: "Move The Blog to AWS"
date: "2023-06-12"
categories: 
  - "activity"
tags: 
  - "aws"
  - "digitalocean"
  - "lightsail"
  - "linode"
summary: "Why I abandoned DigitalOcean for AWS: billing nightmares vs the reliable cloud infrastructure I needed"
---

I recently moved my blog(s) from DigitalOcean (DO) to AWS (Amazon Web Service). This is the very first time I use AWS service for my blog in my whole life. I use Lightsail product from AWS, because it's more simple to manage compared to Amazon EC2. I know that EC2 is more customizable compared to Lightsail, but at this moment I just don't have the time to do so.

```
I edited this post at the end of it. You can read about the issue I face after migrating to AWS.
```

### The reason

I have been using DO for about a year after years of using Linode previously. It was a little bit different compared to Linode, but still manageable for newbies. DO offers quite a lot of services just like Linode, but I believe DO has been promoting their services more than Linode. Unsprisingly they have many users, even though DO and Linode are in the same market.

So, switching out from Linode to DO, mainly due to my curiosity, because we always see their ads everywhere online, and many developers also use it. The other reason is that for my setup, Linode charges me about a USD more. I only use one of the cheapest service, though.

Then as I said before, I used DO for about a year or so. Speed wise, quite fast. My blogs load quite quickly, even though I don't pay more for other service like CDN. But still acceptable. Documentation wise, they also have very complete one, and there are many tutorials online about their service.

**But…**

The thing that makes me discontinue using DO was the billing. They would email reminders to pay the bills, starting from the middle of the month, every about few days. They would tell you that you owe them some $, don't forget to pay for the service will be stopped, blah blah blah.

A reminder to pay the "DO droplet" bill is ok, but the thing is, they, I don't know why, don't accept my credit card for automatic monthly payment. After contacting their support, they said that the card was declined because their system doesn't accept payment from my bank or something like that.

In Linode, it had never been the case. So do the other merchant. My card is legit, and I never scammed/ phised anybody using any fraudulent stuff.

After months of feeling that frustration, I decided to explore another alternatives. I had been exploring many VPS providers many times already, obviously there were many, but I think they were all would feel just like Linode or DO.

#### Choosing AWS

AWS is kind of an elephant in the room. It's probably the biggest cloud service provider with millions of users from retail to business (B2B) customers. The only "people" that competing against it are Microsoft Azure and Google's Cloud Platform (GCP). I am not that familiar about Microsoft Azure platform, and GCP is kind of expensive (I heard), and I don't want to keep all my stuff there, as I am afraid there would be some vendor lock in issues, and I couldn't do much about it. That would be another pain in the arse.

**So, it's a no brainer to choose AWS.**

The only issue about it, is that, from my earliest experience exploring AWS services is that it felt like getting lost in a jungle. Their UI/UX was not the best. And also I was afraid that it would cost much more compared to Linode or DO.

But that has been changed already. Amazon as a huge company is surely aware about the issue, and they improve their UI/UX significantly. The pricing is also competitive, you can find a $3/month service on AWS. So, why not using AWS I think.

#### Migrating to AWS

Migrating from one cloud provider to another can be one of the worst headaches, and time consuming. Luckily I have already done it before a lot of times, so I still have some experience about it. And my blogs are not that big, so the backup size is not so much, and could quickly be downloaded as well in order to prepare the migration.

#### Navigating AWS Lightsail

Before migrating, I watched some tutorials and read some as well. It's a little bit more challenging compared to Linode and DO, but not that hard actually. AWS Lightsail is much friendlier to use compared to EC2 or others, even though in terms of scalability and customization, Lightsail is not that advanced. But for my personal use, that's just fine. My blogs only serve a few thousands of visits every month accumulatively, so no need to have much computing and storage.

One of the best thing of using AWS is they provide some free trial usage, and for me I have about 3 months of free usage for the Lightsail I use. On top of that, monthly I would pay less than I paid in Linode and DO (so far).

#### Completing the migration

In total, I spent about 4-6 hours of migrating from DO to AWS Lightsail. I moved all my blogs from DO to Lightsail, then I closed my DO account for good. I don't want to get any bills from them anymore. But before that, surely I paid all my bills.

So now this blog is using AWS Lightsail, so far no issue yet, only some glitch when accessing it from browsers that doesn't redirect to HTTPS by default. Even though I already set it up on the backend. I don't know what I was missing, though.

Hopefully everything is going to be alright with this, I don't want to have some billing issues and unpredictable cost no more. AWS is so huge, that I believe they won't charge me more unnecessarily. LoL.

_Keep grinding!_

**Edit:**  
**June 14th 2023:**  
A few days ago my blog was down for a few minutes due to some unidentified issues. I still don't have any idea why it happened. It needs some investigations for sure, but until the next incident happens, I won't do anything yet. Just a few minutes ago, I saw my "REMAINING CPU BURST CAPACITY" chart on my AWS Lightsail metrics spiking high moving towards 85%. That seems to be a same symptom with the previous issue. I didn't do anything backend wise, and the stats is just doing as usual, it is not visited for more than 100s today. I'll be aware.
