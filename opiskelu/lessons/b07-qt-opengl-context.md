# QOpenGLWidget renderöi mustaa — context ei ole current. Mitä kutsutaan ennen piirtoa?

**Ratkaisu:** `makeCurrent()` widgetin OpenGL-kontekstissa ennen piirtokutsuja:

```cpp
void MyGLWidget::paintGL() {
    makeCurrent();
    // glDraw...
    doneCurrent();  // valinnainen jos jaat kontekstia
}
```

Ilman current-kontekstia GL-komennot eivät vaikuta näkyvään framebufferiin.
