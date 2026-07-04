# 3D-scene: lähemmät objektit piirtyvät etäisempien päälle väärin. OpenGL-asetus?

## Tilanne

3D-kuutioita piirretään perspektiiviprojektiolla, mutta kauempana oleva kolmio peittää lähemmän — Z-järjestys on väärin. Syynä on depth test pois päältä tai puuttuva depth buffer.

## Ratkaisu

Ota depth test käyttöön: `glEnable(GL_DEPTH_TEST)` + depth buffer format:

```cpp
// main() — ennen widgetin luontia
QSurfaceFormat fmt;
fmt.setDepthBufferSize(24);
fmt.setStencilBufferSize(8);
QSurfaceFormat::setDefaultFormat(fmt);

void SceneWidget::initializeGL() {
    glEnable(GL_DEPTH_TEST);
    glDepthFunc(GL_LESS);
    glClearDepth(1.0);
}

void SceneWidget::paintGL() {
    makeCurrent();
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    m_shaderProgram.bind();
    for (const auto &obj : m_objects) {
        m_shaderProgram.setUniformValue("uMVP", m_projection * m_view * obj.modelMatrix);
        obj.vao.bind();
        glDrawArrays(GL_TRIANGLES, 0, obj.vertexCount);
    }
}
```

Depth buffer tallentaa fragmentin Z-arvon; `GL_LESS` piirtää vain lähempänä olevat pikselit.

## Käytännössä

Transparentti objektit vaativat erillisen läpinäkyvyys-passin (depth write off, back-to-front). Tarkista projection-matriisin near/far clip -arvot — liian kapea väli aiheuttaa Z-fightingia. `glClear` pitää sisältää `GL_DEPTH_BUFFER_BIT` joka framella.

[Lue lisää](https://www.khronos.org/opengl/wiki/Depth_Test)
