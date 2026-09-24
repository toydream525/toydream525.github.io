(() => {
  const button = document.getElementById("copy-config");
  const status = document.getElementById("copy-status");
  if (!button || !status) return;

  const instructions = `我想在 Windows 上使用 YuriAqua 的开源桌面工具「DSH 伴航」管理本地 GGUF 模型，并按需连接 DeepSeek Harness。请先询问我的 CPU、GPU 型号和显存、RAM、Windows 版本、可用磁盘、是否需要 DSH Agent，再给出适合这台电脑的配置步骤。请从 llama.cpp 官方 Releases 选择完整的 Windows CPU 或适配 GPU 引擎包及该版本必需的 DLL，不要默认要求安装完整 CUDA Toolkit。帮我选能负担的 GGUF 模型、量化和上下文，从小配置试起；不要保证任意电脑能运行 27B/32K。

如果我明确要复现内置 Qwen 参考配方：参考硬件为 i7-13700K、RTX 4080 16 GB、64 GB RAM；模型是 Huihui Qwen3.8-27B abliterated GSQ-RCO IQ3_S 与 Original Qwen3.8-27B GSQ-RCO IQ3_S，32K、单并发、MTP 关闭。请让我从对应 Hugging Face 仓库取得完整 GGUF，并从 froggeric/Qwen-Fixed-Chat-Templates 固定提交 855bffc 取得 chat_template.jinja；在伴航里检测引擎、模型入库、一键预览/导入并绑定模板，缺资源时保持待绑定。写作 IQ4_XS 和 64K 以上属于另外的配置选择，须按硬件调整并独立验证。

只做本地模型试聊时不需要 DeepSeek 云端 API Key、Node.js 或 DSH。若我要运行 DSH Agent，才指导我从官方来源安装 Node.js 和完整 DeepSeek Harness 本地安装树，绑定 node.exe 与包含 node_modules/@deepseek-ai/dsh/lib/bin.js 的目录，启动并认证 DSH，把本地模型 API 接入提供方。最后检查 API 就绪、中文试聊、工具结果回传，以及只在我允许的测试目录内做真实文件任务。不要读取、索取或公开我的密钥、认证链接和私人文件；任何驱动/系统改动先解释风险。`;

  button.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(instructions);
      } else {
        const field = document.createElement("textarea");
        field.value = instructions;
        field.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("copy failed");
      }
      status.textContent = "已复制。请粘贴到你信任的 AI 助手。";
      button.textContent = "已复制 ✓";
      window.setTimeout(() => { button.innerHTML = '复制配置说明 <span aria-hidden="true">▤</span>'; }, 2600);
    } catch {
      status.textContent = "复制失败，请检查浏览器剪贴板权限后重试。";
    }
  });
})();
