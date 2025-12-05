# personal-portfolio-site
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kunal Ray - Data Analyst & Web Developer</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <style>
        /* ===== COMPLETE PORTFOLIO - SINGLE FILE BY KUNAL RAY ===== */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --primary: #667eea; --primary-dark: #764ba2; --secondary: #f093fb; --secondary-dark: #f5576c;
            --text-dark: #2c3e50; --text-light: #7f8c8d; --bg-light: #f8f9fa; --white: #ffffff;
            --shadow: 0 10px 30px rgba(0,0,0,0.1); --shadow-hover: 0 20px 40px rgba(0,0,0,0.15);
        }
        [data-theme="dark"] {
            --text-dark: #ecf0f1; --text-light: #bdc3c7; --bg-light: #2c3e50; --white: #34495e;
        }
        body { font-family: 'Poppins', sans-serif; line-height: 1.6; color: var(--text-dark); overflow-x: hidden; scroll-behavior: smooth; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        /* NAVBAR */
        .navbar { position: fixed; top: 0; width: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); z-index: 1000; transition: all 0.3s ease; box-shadow: var(--shadow); }
        [data-theme="dark"] .navbar { background: rgba(44,62,80,0.95); }
        .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; height: 70px; }
        .nav-logo a { font-size: 1.8rem; font-weight: 700; color: var(--primary); text-decoration: none; }
        .nav-menu { display: flex; list-style: none; gap: 2rem; }
        .nav-link { text-decoration: none; color: var(--text-dark); font-weight: 500; transition: color 0.3s ease; position: relative; }
        .nav-link:hover, .nav-link.active { color: var(--primary); }
        .nav-link::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px; background: var(--primary); transition: width 0.3s ease; }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .nav-toggle { display: none; flex-direction: column; cursor: pointer; }
        .bar { width: 25px; height: 3px; background: var(--text-dark); margin: 3px 0; transition: 0.3s; }
        .theme-toggle { font-size: 1.2rem; cursor: pointer; padding: 8px; border-radius: 50%; transition: all 0.3s ease; }
        .theme-toggle:hover { background: var(--primary); color: white; }
        /* HERO */
        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, var(--primary), var(--secondary)); animation: gradientShift 15s ease infinite; }
        @keyframes gradientShift { 0%,100%{background-position:0% 50%}50%{background-position:100% 50%} }
        .hero-content { z-index: 2; text-align: center; color: white; max-width: 800px; padding: 0 20px; }
        .hero-title { font-size: clamp(2.5rem,5vw,4rem); font-weight: 700; margin-bottom: 1rem; }
        .gradient-text { background: linear-gradient(45deg,#fff,var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .typing-container { font-size: clamp(1.2rem,3vw,2rem); font-weight: 600; margin: 1rem 0; min-height: 50px; display: flex; align-items: center; justify-content: center; }
        .cursor { animation: blink 1s infinite; }
        @keyframes blink { 0%,50%{opacity:1}51%,100%{opacity:0} }
        .hero-desc { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn { padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: inline-block; }
        .btn-primary { background: white; color: var(--primary); }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); }
        .btn-secondary { border: 2px solid white; color: white; }
        .btn-secondary:hover { background: white; color: var(--primary); }
        .scroll-indicator { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); color: white; font-size: 1.5rem; animation: bounce 2s infinite; }
        @keyframes bounce { 0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)} }
        /* SECTIONS */
        .section { padding: 100px 0; }
        .section-title { font-size: clamp(2rem,4vw,3rem); text-align: center; margin-bottom: 4rem; font-weight: 700; }
        /* ABOUT */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .profile-img { width: 100%; height: 400px; object-fit: cover; border-radius: 20px; box-shadow: var(--shadow); }
        .about-content h3 { font-size: 2rem; margin-bottom: 1rem; color: var(--primary); }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0; }
        .info-item { display: flex; align-items: center; gap: 1rem; }
        .info-item i { color: var(--primary); font-size: 1.2rem; }
        /* SKILLS */
        .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
        .skills-category h3 { font-size: 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; color: var(--primary); }
        .skill-bar { margin-bottom: 1.5rem; }
        .skill-bar span { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        .progress { height: 8px; background: #e0e0e0; border-radius: 10px; overflow: hidden; position: relative; }
        .progress::after { content: ''; position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg,var(--primary),var(--secondary)); border-radius: 10px; width: 0; transition: width 2s ease; }
        .skill-item { display: flex; justify-content: space-between; margin-bottom: 1rem; padding: 1rem; background: var(--bg-light); border-radius: 10px; }
        /* PROJECTS */
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(350px,1fr)); gap: 2rem; }
        .project-card { background: var(--white); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow); transition: all 0.4s ease; }
        .project-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-hover); }
        .project-card img { width: 100%; height: 250px; object-fit: cover; }
        .project-content { padding: 2rem; }
        .project-content h3 { font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-dark); }
        .project-tech { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; }
        .project-tech span { background: var(--bg-light); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
        .project-links { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .btn-demo { flex: 1; text-align: center; background: var(--primary); color: white; }
        .btn-code { flex: 1; text-align: center; border: 2px solid var(--primary); color: var(--primary); }
        .btn-demo:hover, .btn-code:hover { transform: translateY(-2px); }
        /* SERVICES */
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: 2rem; }
        .service-card { text-align: center; padding: 3rem 2rem; background: var(--white); border-radius: 20px; box-shadow: var(--shadow); transition: all 0.4s ease; }
        .service-card:hover { transform: translateY(-10px); }
        .service-icon { width: 80px; height: 80px; background: linear-gradient(135deg,var(--primary),var(--secondary)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem; color: white; }
        .service-card h3 { font-size: 1.3rem; margin-bottom: 1rem; }
        /* CONTACT */
        .contact-content { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .contact-info h3 { font-size: 2rem; margin-bottom: 1rem; color: var(--primary); }
        .contact-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; font-size: 1.1rem; }
        .contact-item i { color: var(--primary); font-size: 1.3rem; width: 40px; }
        .social-links { display: flex; gap: 1rem; margin-top: 2rem; }
        .social-links a { width: 50px; height: 50px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; transition: all 0.3s ease; }
        .social-links a:hover { transform: translateY(-3px) scale(1.1); }
        .contact-form { background: var(--bg-light); padding: 2.5rem; border-radius: 20px; }
        .form-group { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .form-group input, .form-group textarea { flex: 1; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 10px; font-family: inherit; transition: border-color 0.3s ease; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary); }
        /* FOOTER */
        .footer { background: var(--text-dark); color: white; text-align: center; padding: 2rem 0; position: relative; }
        .back-to-top { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: var(--primary); border: none; border-radius: 50%; color: white; font-size: 1.2rem; cursor: pointer; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 1000; }
        .back-to-top.show { opacity: 1; visibility: visible; }
        /* RESPONSIVE */
        @media (max-width: 768px) {
            .nav-menu { position: fixed; left: -100%; top: 70px; flex-direction: column; background: var(--white); width: 100%; text-align: center; transition: 0.3s; box-shadow: var(--shadow); padding: 2rem 0; }
            .nav-menu.active { left: 0; }
            .nav-toggle { display: flex; }
            .about-grid, .skills-grid, .contact-content { grid-template-columns: 1fr; gap: 2rem; }
            .hero-buttons { flex-direction: column; align-items: center; }
            .projects-grid, .services-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <!-- NAVBAR -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="nav-logo"><a href="#home">KR</a></div>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="#home" class="nav-link active">Home</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#skills" class="nav-link">Skills</a></li>
                <li><a href="#projects" class="nav-link">Projects</a></li>
                <li><a href="#services" class="nav-link">Services</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="nav-toggle" id="nav-toggle">
                <span class="bar"></span><span class="bar"></span><span class="bar"></span>
            </div>
            <div class="theme-toggle" id="theme-toggle"><i class="fas fa-moon"></i></div>
        </div>
    </nav>

    <!-- HERO -->
    <section id="home" class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
            <h1 class="hero-title">Hi, I'm <span class="gradient-text">Kunal Ray</span></h1>
            <div class="typing-container">
                <span class="typed-text" id="typed-text"></span>
                <span class="cursor">|</span>
            </div>
            <p class="hero-desc">Passionate Data Analyst & Web Developer creating impactful dashboards, visualizations, and modern web experiences. Transforming data into actionable insights.</p>
            <div class="hero-buttons">
                <a href="#contact" class="btn btn-primary">Hire Me</a>
                <a href="#contact" class="btn btn-secondary">Download CV</a>
            </div>
        </div>
        <div class="scroll-indicator"><i class="fas fa-chevron-down"></i></div>
    </section>

    <!-- ABOUT -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">About Me</h2>
            <div class="about-grid">
                <div class="about-image" data-aos="fade-right">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" alt="Kunal Ray" class="profile-img">
                </div>
                <div class="about-content" data-aos="fade-left">
                    <h3>Data Analyst & Web Developer</h3>
                    <p>I specialize in transforming complex datasets into actionable business insights through Power BI, Tableau, and Python. I also craft responsive, modern websites using HTML, CSS, JavaScript, and React.</p>
                    <div class="info-grid">
                        <div class="info-item"><i class="fas fa-calendar"></i><span>Age: 26</span></div>
                        <div class="info-item"><i class="fas fa-envelope"></i><span>kunarray@example.com</span></div>
                        <div class="info-item"><i class="fas fa-map-marker-alt"></i><span>Bengaluru, India</span></div>
                        <div class="info-item"><i class="fas fa-phone"></i><span>+91 98765 43210</span></div>
                    </div>
                    <a href="#contact" class="btn btn-primary">Download CV</a>
                </div>
            </div>
        </div>
    </section>

    <!-- SKILLS -->
    <section id="skills" class="section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Skills</h2>
            <div class="skills-grid">
                <div class="skills-category" data-aos="fade-up">
                    <h3><i class="fas fa-laptop-code"></i> Technical Skills</h3>
                    <div class="skill-bar"><span>Python (Pandas, NumPy)</span><div class="progress" data-width="90"></div></div>
                    <div class="skill-bar"><span>Power BI</span><div class="progress" data-width="95"></div></div>
                    <div class="skill-bar"><span>Tableau</span><div class="progress" data-width="85"></div></div>
                    <div class="skill-bar"><span>SQL / MySQL</span><div class="progress" data-width="88"></div></div>
                    <div class="skill-bar"><span>JavaScript / React</span><div class="progress" data-width="80"></div></div>
                    <div class="skill-bar"><span>Excel Advanced</span><div class="progress" data-width="92"></div></div>
                </div>
                <div class="skills-category" data-aos="fade-up" data-aos-delay="200">
                    <h3><i class="fas fa-users"></i> Professional Skills</h3>
                    <div class="skill-item">Communication <span>95%</span></div>
                    <div class="skill-item">Problem Solving <span>90%</span></div>
                    <div class="skill-item">Critical Thinking <span>88%</span></div>
                    <div class="skill-item">Teamwork <span>92%</span></div>
                    <div class="skill-item">Presentation <span>87%</span></div>
                </div>
            </div>
        </div>
    </section>

    <!-- PROJECTS -->
    <section id="projects" class="section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Projects</h2>
            <div class="projects-grid">
                <div class="project-card" data-aos="fade-up">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" alt="Sales Dashboard">
                    <div class="project-content">
                        <h3>Sales Performance Dashboard</h3>
                        <p>Interactive Power BI dashboard tracking sales metrics across multiple regions with drill-down capabilities.</p>
                        <div class="project-tech"><span>Power BI</span><span>Excel</span><span>SQL</span></div>
                        <div class="project-links"><a href="#" class="btn btn-demo">Live Demo</a><a href="#" class="btn btn-code">Source Code</a></div>
                    </div>
                </div>
                <div class="project-card" data-aos="fade-up" data-aos-delay="100">
                    <img src="https://images.unsplash.com/photo-1551288049-b1f4a9d32f02?w=400" alt="Customer Analytics">
                    <div class="project-content">
                        <h3>Customer Analytics Dashboard</h3>
                        <p>Tableau dashboard analyzing customer behavior, retention rates, and lifetime value predictions.</p>
                        <div class="project-tech"><span>Tableau</span><span>Python</span><span>MySQL</span></div>
                        <div class="project-links"><a href="#" class="btn btn-demo">Live Demo</a><a href="#" class="btn btn-code">Source Code</a></div>
                    </div>
                </div>
                <div class="project-card" data-aos="fade-up" data-aos-delay="200">
                    <img src="https://images.unsplash.com/photo-1517433456452-df4d8e62c416?w=400" alt="E-commerce">
                    <div class="project-content">
                        <h3>E-commerce Analytics</h3>
                        <p>Advanced Excel dashboard with VBA automation for real-time e-commerce performance tracking.</p>
                        <div class="project-tech"><span>Excel VBA</span><span>Power Query</span></div>
                        <div class="project-links"><a href="#" class="btn btn-demo">Live Demo</a><a href="#" class="btn btn-code">Source Code</a></div>
                    </div>
                </div>
                <div class="project-card" data-aos="fade-up" data-aos-delay="300">
                    <img src="https://images.unsplash.com/photo-1518957647508-e6f87f5d4a12?w=400" alt="SQL Project">
                    <div class="project-content">
                        <h3>SQL Database Analysis</h3>
                        <p>Complex SQL queries and database optimization for sales and inventory management system.</p>
                        <div class="project-tech"><span>MySQL</span><span>Python</span></div>
                        <div class="project-links"><a href="#" class="btn btn-demo">Live Demo</a><a href="#" class="btn btn-code">Source Code</a></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SERVICES -->
    <section id="services" class="section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Services</h2>
            <div class="services-grid">
                <div class="service-card" data-aos="fade-up">
                    <div class="service-icon"><i class="fas fa-chart-line"></i></div>
                    <h3>Business Dashboards</h3>
                    <p>Custom Power BI & Tableau dashboards for data-driven decision making</p>
                </div>
                <div class="service-card" data-aos="fade-up" data-aos-delay="100">
                    <div class="service-icon"><i class="fas fa-broom"></i></div>
                    <h3>Data Cleaning</h3>
                    <p>Automated data preprocessing pipelines with Python & Excel VBA</p>
                </div>
                <div class="service-card" data-aos="fade-up" data-aos-delay="200">
                    <div class="service-icon"><i class="fas fa-chart-bar"></i></div>
                    <h3>Data Visualization</h3>
                    <p>Compelling charts, graphs, and interactive visualizations</p>
                </div>
                <div class="service-card" data-aos="fade-up" data-aos-delay="300">
                    <div class="service-icon"><i class="fas fa-code"></i></div>
                    <h3>Web Development</h3>
                    <p>Modern, responsive websites with HTML, CSS, JavaScript</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info" data-aos="fade-right">
                    <h3>Let's work together!</h3>
                    <p>Ready to transform your data or build your next website?</p>
                    <div class="contact-item"><i class="fas fa-envelope"></i><span>kunarray@example.com</span></div>
                    <div class="contact-item"><i class="fas fa-phone"></i><span>+91 98765 43210</span></div>
                    <div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>Bengaluru, India</span></div>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                        <a href="#"><i class="fab fa-github"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
                <form class="contact-form" data-aos="fade-left">
                    <div class="form-group">
                        <input type="text" placeholder="Your Name" required>
                        <input type="email" placeholder="Your Email" required>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Subject" required>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Kunal Ray. Made with ❤️ for Data & Web.</p>
            <button class="back-to-top" id="backToTop"><i class="fas fa-chevron-up"></i></button>
        </div>
    </footer>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        /* ===== COMPLETE PORTFOLIO JS - KUNAL RAY ===== */
        AOS.init({duration:1000,once:true});
        // Navbar
        const navbar=document.getElementById('navbar'),navToggle=document.getElementById('nav-toggle'),navMenu=document.getElementById('nav-menu'),navLinks=document.querySelectorAll('.nav-link'),themeToggle=document.getElementById('theme-toggle');
        navToggle.addEventListener('click',()=>{navMenu.classList.toggle('active')});
        navLinks.forEach(link=>link.addEventListener('click',()=>{navMenu.classList.remove('active')}));
        window.addEventListener('scroll',()=>{if(window.scrollY>50)navbar.style.background='rgba(255,255,255,0.98)';else navbar.style.background='rgba(255,255,255,0.95)'});
        // Active nav
        window.addEventListener('scroll',()=>{let current='';document.querySelectorAll('section').forEach(section=>{const sectionTop=section.offsetTop;if(scrollY>=sectionTop-200)current=section.getAttribute('id')});navLinks.forEach(link=>{link.classList.remove('active');if(link.getAttribute('href')===`#${current}`)link.classList.add('active')})});
        // Typing
        const typedText=document.getElementById('typed-text'),words=['Data Analyst','Web Developer','Dashboard Creator','Data Visualizer'],wordIndex=0,charIndex=0,isDeleting=false;
        function typeWriter(){const currentWord=words[wordIndex];if(isDeleting){typedText.textContent=currentWord.substring(0,charIndex-1);charIndex--}else{typedText.textContent=currentWord.substring(0,charIndex+1);charIndex++}if(!isDeleting&&charIndex===currentWord.length){setTimeout(()=>isDeleting=true,2000)}else if(isDeleting&&charIndex===0){isDeleting=false;wordIndex=(wordIndex+1)%words.length}const typeSpeed=isDeleting?100:150;setTimeout(typeWriter,typeSpeed)}typeWriter();
        // Theme
        themeToggle.addEventListener('click',()=>{document.body.dataset.theme=document.body.dataset.theme==='dark'?'light':'dark';const icon=themeToggle.querySelector('i');icon.classList.toggle('fa-moon');icon.classList.toggle('fa-sun');localStorage.setItem('theme',document.body.dataset.theme)});
        const savedTheme=localStorage.getItem('theme')||'light';document.body.dataset.theme=savedTheme;if(savedTheme==='dark')themeToggle.querySelector('i').classList.replace('fa-moon','fa-sun');
        // Skills
        const progressBars=document.querySelectorAll('.progress');window.addEventListener('scroll',()=>{progressBars.forEach(bar=>{const progress=bar.getAttribute('data-width');if(bar.getBoundingClientRect().top<window.innerHeight-100)bar.style.setProperty('--progress',progress+'%')})});
        // Form
        document.querySelector('.contact-form').addEventListener('submit',(e)=>{e.preventDefault();alert('Thank you! I\'ll get back soon.');e.target.reset()});
        // Back to top
        const backToTop=document.getElementById('backToTop');window.addEventListener('scroll',()=>{if(window.scrollY>500)backToTop.classList.add('show');else backToTop.classList.remove('show')});backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor=>anchor.addEventListener('click',function(e){e.preventDefault();document.querySelector(this.getAttribute('href')).scrollIntoView({behavior:'smooth',block:'start'})}));
    </script>
</body>
</html>

