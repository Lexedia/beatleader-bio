# beatleader bio

a project to generate the bio for my beatleader profile

<sub>idk go stalk another project</sub>

## Setup
It's kind of janky, but basically, have [mise](https://mise.jdx.dev) installed.
Then run `mise install && pnpm i`

If you want to change/edit stuff, use `pnpm dev` and to your changes, everything will be hotreloaded.

Also, because the beatleader bio editor is veeeery laggy and slow, I really advise you to use the `pnpm push` script, that will automatically push your changes to the server.
You do however need to have your beatleader auth cookie set in the `.env` file as `BL_COOKIE`.

To get it, just go to the Network tab and find the first request to `api.beatleader.com` with a `Cookie` header set. Or go to Storage and copy the value of the `.AspNetCore.Cookies` cookie.

### Credits

- For the Reesabers:
  -  [mipity](https://discord.com/users/1082043605058855036) for the models
  -  [sync](https://discord.com/users/163035671819321344) for the preview
  - base model can be found [here](https://discord.com/channels/921820046345523311/1552408901608149002/1552408901608149002), im just keeping the file here since beatleader allows `raw.githubusercontent.com` as a host.

- [Reezonate](https://github.com/Reezonate) for his bio, that I've mainly taken inspiration from.

- [BeatLeader](https://beatleader.com) to allow such wonderful customisation.

