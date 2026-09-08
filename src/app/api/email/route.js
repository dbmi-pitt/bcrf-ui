import { Resend } from 'resend';
import GlobusDataSetEmail from '@/components/email/GlobusDataSetEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const templates = {
  globusDataSet: GlobusDataSetEmail,
};

export async function POST(req) {
  try {
    const { template, to, subject, templateProps = {} } = await req.json();

    const EmailTemplate = templates[template];
    if (!EmailTemplate) {
      return Response.json(
        { error: `Unknown template: ${template}` },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'help@bcrfglobaldatahub.org',
      to,
      subject,
      react: <EmailTemplate {...templateProps} />,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
