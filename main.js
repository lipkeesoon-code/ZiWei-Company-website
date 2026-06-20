document.addEventListener('DOMContentLoaded', () => {
    // 导航栏切换逻辑
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = {
        'home': document.getElementById('section-home'),
        'about': document.getElementById('section-about'),
        'services': document.getElementById('section-services'),
        'chart': document.getElementById('section-chart'),
        'contact': document.getElementById('section-contact')
    };

    // 默认如果没带hash，优先显示目前有的模块，由于用户截图是关于我，我们可以默认显示关于我，或者保持原有的联系我
    // 这里我们添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // 移除所有 active 类
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // 只有 about 和 contact 有对应的 DOM 时才做切换动作
            if (sections[target]) {
                this.classList.add('active');
                
                // 隐藏所有模块
                Object.values(sections).forEach(sec => {
                    if (sec) sec.style.display = 'none';
                });
                
                // 显示对应模块
                sections[target].style.display = 'flex';
                
                // 切换背景
                document.body.classList.remove('bg-home', 'bg-about', 'bg-services', 'bg-chart', 'bg-contact');
                if (target === 'home') {
                    document.body.classList.add('bg-home');
                } else if (target === 'about') {
                    document.body.classList.add('bg-about');
                } else if (target === 'services') {
                    document.body.classList.add('bg-services');
                } else if (target === 'chart') {
                    document.body.classList.add('bg-chart');
                } else if (target === 'contact') {
                    document.body.classList.add('bg-contact');
                }
            } else {
                // 对于目前还没做页面的标签，仅添加 active 效果
                this.classList.add('active');
            }
        });
    });

    // 默认触发一次 "主页" 页面展示
    const homeLink = document.querySelector('.nav-home');
    if (homeLink) homeLink.click();

    // 表单提交处理
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 改变按钮状态为发送中
            const originalText = submitBtn.innerText;
            const originalBg = submitBtn.style.backgroundColor;
            submitBtn.innerText = '发送中...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';

            // 收集表单数据
            const formData = new FormData(contactForm);
            
            // 使用 formsubmit.co 进行 AJAX 提交，目标邮箱为您指定的邮箱
            fetch("https://formsubmit.co/ajax/lipkeesoon@hotmail.com", {
                method: "POST",
                headers: { 
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.success === "true" || data.success === true) {
                    // 发送成功，改变按钮文字和颜色
                    submitBtn.innerText = '成功发送 ✓';
                    submitBtn.style.backgroundColor = '#6e8a5b'; // 稍微深一点的绿色
                    submitBtn.style.color = '#FFF';
                    submitBtn.style.opacity = '1';
                    
                    // 播放成功提示音
                    playSuccessSound();
                    
                    // 清空表单内容
                    contactForm.reset();
                    
                    // 4秒后恢复按钮原本状态
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = originalBg;
                    }, 4000);
                } else {
                    // 处理尚未激活的情况
                    if(data.message && (data.message.includes('activate') || data.message.includes('Action Required'))) {
                        alert('【重要】首次使用需要激活！\n请登录 lipkeesoon@hotmail.com（检查收件箱或垃圾邮件），找到 FormSubmit 发来的激活邮件并点击激活。');
                    }
                    throw new Error(data.message || '提交失败');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                submitBtn.innerText = '请先去邮箱点击激活';
                submitBtn.style.backgroundColor = '#d9534f';
                submitBtn.style.color = '#FFF';
                submitBtn.style.opacity = '1';
                
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = originalBg;
                }, 4000);
            });
        });
    }

    // 播放提示音函数 (使用浏览器内置 Web Audio API，无需外部音频文件)
    function playSuccessSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            // 创建振荡器
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            // 设定音色和音调 (清脆的“叮”声)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
            osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // 升调
            
            // 设定音量衰减
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            
            // 播放
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } catch(e) {
            console.log('您的浏览器不支持 Web Audio API');
        }
    }

    // 性别按钮切换逻辑
    const genderBtns = document.querySelectorAll('.gender-btn input');
    genderBtns.forEach(input => {
        input.addEventListener('change', (e) => {
            document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
            if(e.target.checked) e.target.parentElement.classList.add('active');
        });
    });
});
