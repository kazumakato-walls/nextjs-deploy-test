import { Title, Text, Anchor ,Button} from '@mantine/core';
import classes from './Welcome.module.css';
import Link from "next/link";

export function Welcome() {

  const test = () => {
    const test = process.env.NEXT_PUBLIC_URL;
    const test2 = process.env.CUSTOMCONNSTR_NEXT_PUBLIC_BACKEND;
    console.log("Backend URL:", process.env.NEXT_PUBLIC_URL);
    console.log("Backend URL:", process.env.NEXTAUTH_SECRET);
    console.log("Backend URL:", process.env.CUSTOMCONNSTR_NEXT_PUBLIC_BACKEND);
    console.log("Backend URL:", test);
    console.log("Backend URL:", test2);
  }

  return (
    <>
      <Link href="/cloud_directory"
      // <Link href="/api/auth/signout"
      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">          
        <Title className={classes.title} ta="center" mt={100}>
            <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'blue' }}>
                Walls {' '}
            </Text>
            <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'pink' }}>
                Cloud {' '}
            </Text>
            <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
                Directory
            </Text>
        </Title>
      </Link>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Walls Cloud Directory はインターネットを通じてデータを
        保存・アクセス・共有を行うことができるプラットフォームです。
      </Text>
      <Button onClick={test}>test</Button>
    </>
  );
}