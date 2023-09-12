import { Layout, Line, Rect, Txt, View2D } from '@motion-canvas/2d/lib/components';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { createRef } from '@motion-canvas/core/lib/utils';
import { CodeBlock, edit, insert, lines, remove, word } from '@motion-canvas/2d/lib/components/CodeBlock';
import { prismaCodeTheme, tsCodeTheme } from '../utils';
import { Color, Direction, Reference, Vector2, all, beginSlide, createSignal, easeInOutCubic, loop, makeRef, slideTransition, waitFor, waitUntil } from '@motion-canvas/core';

export const ORANGE = '#FF7452';
export const WHITE = '#FAFAFA';
export const GREEN = '#6EC23A';
export const BLACK = '#2c2c2c';
export const BG_BLACK = '#1f1f1f';
export const PINK = '#F34DFF';

type ObjectVector2 = {
  x: number,
  y: number,
}

function nodeRect(view: View2D, reference: Reference<Rect>, position: ObjectVector2, color: string, radius: number) {
  view.add(
    <Rect
      direction={'column'}
      alignItems={'center'}
      position={[position.x, position.y + 80]}
      opacity={0}
      width={500}
      fill={ORANGE}
      ref={reference}
      radius={40}
      padding={45}
      fontWeight={550}
      layout
    >
      <Txt alignSelf={'center'} fill={BLACK}>Usuário</Txt>
    </Rect>
  );
}

export default makeScene2D(function* (view) {
  const mainRef = createRef<Layout>();
  const userNode = createRef<Rect>();
  const prismaCode1 = createRef<CodeBlock>();
  const tsCode = createRef<CodeBlock>();
  const linePoint = createRef<Line>();
  const linePoint2 = createRef<Line>();
  const createAccNode = createRef<Rect>();
  const authNode = createRef<Rect>();
  const tokenText = createRef<Txt>();
  const sessionNode = createRef<Rect>();

  const userNodePos = { x: -450, y: -250 };
  const prismaCodePos = { x: 400, y: -210 };

  const relationLinePos = Vector2.createSignal(0);
  const relationLine2Pos = Vector2.createSignal(0);

  const newAccPosition = {
    x: userNodePos.x - 100,
    y: userNodePos.y - 100,
  };

  yield* beginSlide('FIRST SLIDE')

  view.add(
    <Layout ref={mainRef}>
      <Layout>
        <Line
          ref={linePoint}
          position={[userNodePos.x, userNodePos.y + 74]}
          opacity={0}
          lineWidth={7}
          stroke={WHITE}
          endArrow
          points={[Vector2.zero, () => Vector2.up.scale(relationLinePos.y()), relationLinePos]}
        />

        <Line
          ref={linePoint2}
          position={[userNodePos.x - 100, userNodePos.y + 82 * 3]}
          opacity={0}
          lineWidth={7}
          stroke={WHITE}
          endArrow
          points={[Vector2.zero, () => Vector2.up.scale(relationLine2Pos.y()), relationLine2Pos]}
        />

        <Txt ref={tokenText}>Token</Txt>
      </Layout>

      <CodeBlock
        opacity={0}
        position={[prismaCodePos.x, prismaCodePos.y + 100]}
        ref={prismaCode1}
        theme={prismaCodeTheme}
        fontSize={40}
        language='prisma'
        code={`
model User { }`
        }
      />

      <CodeBlock
        opacity={0}
        position={[prismaCodePos.x, prismaCodePos.y + 200]}
        ref={tsCode}
        theme={tsCodeTheme}
        fontSize={40}
        language='js'
        code={`
async authorize(credentials: Credentials) {

}`
        }
      />

      <Rect
        direction={'column'}
        alignItems={'center'}
        position={[userNodePos.x, userNodePos.y + 250 + 80 + 45 + 35]}
        opacity={0}
        width={500}
        fill={PINK}
        ref={createAccNode}
        radius={12}
        padding={45}
        fontWeight={550}
        layout
      >
        <Txt alignSelf={'center'} fill={BLACK}>Criar Conta</Txt>
      </Rect>

      <Rect
        direction={'column'}
        alignItems={'center'}
        position={[newAccPosition.x, newAccPosition.y + 250 + 79]}
        opacity={0}
        width={500}
        fill={GREEN}
        ref={authNode}
        radius={4}
        padding={45}
        fontWeight={550}
        layout
      >
        <Txt alignSelf={'center'} fill={BLACK}>Autentificação</Txt>
      </Rect>

      <Rect
        direction={'column'}
        alignItems={'center'}
        position={[newAccPosition.x, newAccPosition.y + 250 * 2 + 70 * 2]}
        opacity={0}
        width={500}
        fill={GREEN}
        ref={sessionNode}
        radius={4}
        padding={45}
        fontWeight={550}
        layout
      >
        <Txt alignSelf={'center'} fill={BLACK}>Sessão</Txt>
      </Rect>
    </Layout>,
  );

  nodeRect(view, userNode, userNodePos, ORANGE, 40)

  yield* all(
    tokenText().opacity(0, 0),
    userNode().opacity(1, 1),
    prismaCode1().opacity(0, 0).to(1, 1),
    prismaCode1().position.y(prismaCodePos.y, .5),
    userNode().position.y(userNodePos.y, .5),
  );

  yield* waitFor(1)

  yield* beginSlide('SECOND SLIDE')

  // Show Line
  yield* all(
    linePoint().opacity(1, 1),
  )

  yield* waitUntil('relate-1')
  yield* relationLinePos.y(250, 1, easeInOutCubic)

  yield* createAccNode().opacity(.3, 1)

  yield* prismaCode1().position([prismaCodePos.x, prismaCodePos.y + 100], .5);
  yield* prismaCode1().edit(1)`
model User {${insert(`
  id String @id @default(cuid())
}`)}`;

  yield* prismaCode1().edit(1)`
model User {
  id String @id @default(cuid())${insert(`

  name          String
  password      String
  email         String
  emailVerified String? // Opcional`)}
}`;
  yield* createAccNode().opacity(1, 1)

  yield* waitFor(1)

  ///!SECTION Authentication
  yield* beginSlide('Authentication')
  yield* all(
    relationLinePos.y(0, 0),
  )
  yield* userNode().opacity(0, 1)
  yield* createAccNode().opacity(.6, 0.6);

  yield* prismaCode1().edit(1.5)`
${remove(`model User {
  id String @id @default(cuid())

  name          String
  password      String
  email         String
  emailVerified String? // Opcional
}`)}`;


  yield* linePoint().opacity(0, .4);
  yield* userNode().opacity(0, .6);
  yield* createAccNode().position([newAccPosition.x, newAccPosition.y], 1);

  yield* prismaCode1().position([prismaCodePos.x - 50, prismaCodePos.y - 125], 0);
  yield* prismaCode1().edit(1.5)`${insert(`
// Tabela de Contas
model Account {

}
`)}`

  waitFor(1)

  yield* all(
    prismaCode1().edit(2)`
  // Tabela de Contas
  model Account {
  ${insert(`
      id String  @id @default(cuid())

      userId             String  @map("user_id")
      type               String
      provider           String
      providerAccountId  String 
      scope              String?

      user User @relation(
        fields: [userId],
        references: [id],
        onDelete: Cascade
      )

      @@unique([provider, providerAccountId])
    }
  `)}`,
    prismaCode1().position([prismaCodePos.x - 50, prismaCodePos.y + 200], 1.5),
  )

  yield* createAccNode().opacity(1, .5)
  yield* waitFor(1)

  yield* prismaCode1().opacity(0, .5);
  yield* tsCode().opacity(1, .5);

  // Grows line
  yield* all(
    relationLinePos.y(0, 0),
    linePoint().position([newAccPosition.x, newAccPosition.y], 0),
    linePoint().opacity(1, 0),
    relationLinePos.y(250, 1, easeInOutCubic)
  );

  yield* authNode().opacity(.4, .4);

  yield* tsCode().position([prismaCodePos.x, prismaCodePos.y], 1)

  yield* tsCode().edit(1)`
  async authorize(credentials: Credentials) {
    ${insert(`// Valida Crendencias do Usuário
  const user = await validateCredentials(
    credentials
  )`)}
  }`;

  yield* authNode().opacity(1, 1);

  yield* linePoint2().opacity(1, .4);
  yield* relationLine2Pos.y(218, 1, easeInOutCubic);

  yield* sessionNode().opacity(.4, .8);

  yield* tsCode().position([prismaCodePos.x - 55, prismaCodePos.y + 215], .8)

  yield* tsCode().edit(1)`
  async authorize(credentials: Credentials) {
    // Valida Crendencias do Usuário
    const user = await validateCredentials(
      credentials
    )

    ${insert(`if (!user) {
      console.error('Falha a validar usuário')
  
      return null
    }
  
    // Gera Token
    const token = generateJwtToken(user)`)}
  }`;

  yield* sessionNode().opacity(1, 1);

  yield* tokenText().position([-250, 130], 0);
  yield* tokenText().fill(WHITE, 0);
  yield* tokenText().opacity(1, 1);
  yield* tsCode().edit(1)`
  async authorize(credentials: Credentials) {
    // Valida Crendencias do Usuário
    const user = await validateCredentials(
      credentials
    )

    if (!user) {
      console.error('Falha a validar usuário')
  
      return null
    }
  
    // Gera Token
    const token = generateJwtToken(user)

    ${insert(`return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    }`)}
  }`;
  yield* tokenText().position([-450, 130], .6);

  ///!SECTION DEMONSTRATION
  yield* beginSlide('DEMONSTRATION')
  // Hide first Slide
  yield* mainRef().opacity(0, 0)

  yield* slideTransition(Direction.Bottom, 1);

  const label = createRef<Rect>();
  const code = createRef<CodeBlock>();
  const position = Vector2.createSignal(0);
  const rotate = createSignal(0);
  const parentY = createSignal(0);

  const axes: Line[] = [];
  const bg = createRef<Rect>();
  const codeBlock = createRef<Rect>();
  const circle = createRef<Rect>();

  // Code part
  yield view.add(
    <>
      <Rect
        // layout
        offset={-1}
        ref={codeBlock}
        x={-960 + 80}
        y={-540 + 80}
        height={1080 - 160}
        width={960}
        clip
      >
        <CodeBlock
          ref={code}
          fontSize={24}
          theme={tsCodeTheme}
          lineHeight={36}
          offsetX={-1}
          x={-960 / 2}
          fontFamily={'JetBrains Mono'}
          code={() =>
            `
            export default makeScene2D(function* (view) {
              view.add(
                <Rect 
                  width={320} 
                  height={320}
                  y={${parentY().toFixed(0)}}
                  rotation={${rotate().toFixed(0)}}
                  // style
                >
                  <Circle 
                    x={${position.x().toFixed(0)}}
                    y={${position.y().toFixed(0)}}
                    width={240} 
                    height={240}
                    // style
                  />
                </Rect>
              );
            });
          `}
        />
      </Rect>
    </>,
  );

  // Demonstration
  view.add(
    <>
      <Rect
        ref={bg}
        rotation={rotate}
        x={400}
        y={parentY}
        width={320}
        height={320}
        fill={'#242424'}
        radius={8}
      >
        <Rect
          ref={circle}
          radius={120}
          width={240}
          height={240}
          position={position}
          fill={WHITE}
        />

        <Line
          ref={makeRef(axes, 0)}
          lineWidth={8}
          stroke={ORANGE}
          endArrow
          points={[Vector2.zero, () => Vector2.right.scale(position.x())]}
        />

        <Line
          ref={makeRef(axes, 1)}
          lineWidth={8}
          stroke={GREEN}
          endArrow
          points={[() => Vector2.right.scale(position.x()), position]}
        />
      </Rect>
    </>,
  );

  yield* slideTransition(Direction.Bottom, .6);

  yield* waitUntil('select');
  yield* code().selection(lines(10, 11), 0.3);

  yield* waitUntil('move_x');
  yield* position.x(200, 1);

  yield* waitUntil('move_y');
  yield* position.y(200, 1);

  yield* waitUntil('rotate');
  yield code().selection(lines(5, 6), 0.6);
  yield* waitFor(0.3);
  yield* all(rotate(180 + 45, 3), parentY(100, 3));

  yield* waitUntil('morph');
  circle().reparent(view);
  axes.forEach(line => line.reparent(view));
  circle().rotation(0);

  yield code().edit(1.2)`
  export default makeScene2D(function* (view) {
    view.add(${edit(
    `
      <Rect 
        width={320} 
        height={320}
        y={${parentY().toFixed(0)}}
        rotation={${rotate().toFixed(0)}}
        // style
      >
        <Circle 
          x={${position.x().toFixed(0)}}
          y={${position.y().toFixed(0)}}
          width={240} 
          height={240}
          // style
        />
      </Rect>`,
    `
      <Rect
        width={null}
        height={640}
        direction={'column'}
        padding={20}
        gap={20}
        layout
        // style
      >
        <Rect width={480} gap={20}>
          <Rect width={360} height={200} />
          <Rect grow={1} />
        </Rect>
        <Rect width={480} grow={1} />
      </Rect>`,
  )}
    );
  });
  `;

  const speed = 0.8;
  yield* all(
    ...axes.map(line => line.start(1, speed)),
    bg().rotation(180, speed),
    bg().position.y(0, speed),
    bg().size([520, 640], speed),
    circle().position([1300 - 960, 340 - 540], speed),
    circle().size([360, 200], speed),
    circle().radius(8, speed),
  );

  const layout = createRef<Rect>();
  view.add(
    <Rect
      ref={layout}
      opacity={0}
      x={400}
      fill={BLACK}
      height={640}
      layout
      direction={'column'}
      gap={20}
      radius={8}
      padding={20}
    >

      <Rect width={480} gap={20}>
        <Rect
          ref={label}
          width={360}
          height={200}
          fill={ORANGE}
          radius={8}
        />
        <Rect grow={1} fill={'#141414'} radius={8} />
      </Rect>

      <Rect width={480} grow={1} fill={'#141414'} radius={8} />
    </Rect>,
  );

  yield* layout().opacity(1, 0.3);
  bg().remove();

  yield* waitUntil('layout_prop');
  yield* code().selection(lines(8), 0.3);

  yield* waitUntil('css');
  yield* code().selection(lines(5, 7), 0.6);

  yield* waitUntil('however');
  yield* code().selection(lines(0, Infinity), 0.32);

  yield* waitUntil('box');

  yield* code().edit(1)
    `export default makeScene2D(function* (view) {
    ${insert(`const box = createRef<Rect>();
    `)}view.add(
      <Rect
        width={null}
        height={640}
        direction={'column'}
        padding={20}
        gap={20}
        layout
        // style
      >
        <Rect width={480} gap={20}>
          <Rect${insert(' ref={box}')} width={360} height={200} />
          <Rect grow={1} />
        </Rect>
        <Rect width={480} grow={1} />
      </Rect>
    );
  });
  `;

  yield* waitUntil('animate');
  yield* code().edit(1)`export default makeScene2D(function* (view) {
  const box = createRef<Rect>();
  view.add(
    <Rect
      width={null}
      height={640}
      direction={'column'}
      padding={20}
      gap={20}
      layout
      // style
    >
      <Rect width={480} gap={20}>
        <Rect ref={box} width={360} height={200} />
        <Rect grow={1} />
      </Rect>
      <Rect width={480} grow={1} />
    </Rect>
  );${insert(`
  
  yield* box().size(['50%', 320], 1).to(80, 1);`)}
});`;

  yield* waitUntil('50%');
  yield* code().selection(word(20, 21, 5), 0.3);

  yield* waitUntil('height');
  yield* code().selection(word(20, 28, 3), 0.3);
  yield* label().size(['50%', 320], 1);

  yield* waitUntil('second');
  yield* code().selection(word(20, 40, 2), 0.3);
  yield* label().size(80, 1);

  yield* waitUntil('translation');
  yield code().selection(lines(0, Infinity), 0.6);
  yield loop(Infinity, () =>
    label().size([360, 200], 1).to(['50%', 320], 1).to(80, 1),
  );

  yield* waitUntil('next');
  yield* waitFor(4);
});