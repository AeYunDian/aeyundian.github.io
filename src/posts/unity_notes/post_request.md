---
icon: pen-to-square
date: 2026-02-17
category:
  - 蔬菜
tag:
  - Unity
  - 笔记
sticky: true
---

# POST网络请求

## 前言

此文章只是POST请求，没有GET、DELETE、PULL等其它类型
为什么一开始是这个呢？因为这是我遇到的第一个问题

## 教程

代码使用系统的Http（using System.Net.Http;）

### 1.新建一个`GameApiClient.cs`的cs文件。
### 2.输入以下内容
```cs
using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;


public class GameApiClient : MonoBehaviour
{
    public static GameApiClient Instance { get; private set; }
    private  HttpClient Client  = new HttpClient();
    private  string Domain = "https://api.io.hb.cn/api/";
    private  HttpResponseMessage response;
    void Awake()
    {

        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            Debug.Log("GameApiClent创建成功！");
        }
        else
        {
            Destroy(gameObject);
            Debug.Log("已存在GameApiClent，销毁重复的");
        }
    }

    public  async Task<HttpResponseMessage>  PostNetData(string path, string json)
    {

        var content = new StringContent(json, Encoding.UTF8, "application/json");
        Client.Timeout = TimeSpan.FromSeconds(5);
        response = await Client.PostAsync(Domain + path, content);

        return response;
    }
}

```
### 3.在游戏第一个场景创建一个空游戏对象，绑定这个代码文件，如果启动游戏，游戏提示`GameApiClent创建成功！`，则代表以上步骤你都完成了
### 4.调用
一个应用应该写一个类来处理网络请求，在其它类中处理返回
要想在其他代码中发送POST请求，只需调用 `GameApiClient.Instance.PostNetData(string path, string json)` 
!!! 警告
    网络请求是异步的，所以需要使用`await`来调用
该函数的返回格式是`HttpResponseMessage`，再具体处理即可
