import { Resend } from 'resend';
import GlobusDataSetEmail from '@/components/email/GlobusDataSetEmail';

let resend;

function getResend() {
  if (resend) {
    return resend;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  resend = new Resend(apiKey);

  return resend;
}

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

    const { data, error } = await getResend().emails.send({
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
