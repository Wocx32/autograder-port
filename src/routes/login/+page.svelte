<script>
    import { enhance } from "$app/forms";
</script>

<h1>Sign in</h1>
<form method="post" use:enhance>
    <label for="username">Username</label>
    <input name="username" id="username" minlength="3" maxlength="31" /><br />
    <label for="password">Password</label>
    <input type="password" name="password" id="password" minlength="6" maxlength="255" /><br />
    <button>Continue</button>
</form>